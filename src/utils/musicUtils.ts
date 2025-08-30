export function formatTime(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000);
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Type alias for enriched recommendation items
export type EnrichedRecommendationItem = MusicKit.Songs;

export function getDisplayName(item: MusicKit.Resource): string {
	return (
		item.attributes.name ||
		item.attributes.title?.stringForDisplay ||
		item.type ||
		"Unknown"
	);
}

export function getArtworkUrl(
	item: MusicKit.Resource,
	size: number = 400,
): string {
	// Recursive function to find artwork URL in nested objects
	const findArtworkUrl = (obj: any): string | null => {
		if (!obj || typeof obj !== "object") {
			return null;
		}

		// Check if this object has an artwork property with a url
		if (obj.artwork?.url && typeof obj.artwork.url === "string") {
			return obj.artwork.url;
		}

		// Recursively search through all properties
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const value = obj[key];

				// If it's an array, search through each item
				if (Array.isArray(value)) {
					for (const item of value) {
						const result = findArtworkUrl(item);
						if (result) return result;
					}
				}
				// If it's an object, recursively search it
				else if (typeof value === "object" && value !== null) {
					const result = findArtworkUrl(value);
					if (result) return result;
				}
			}
		}

		return null;
	};

	const artworkUrl = findArtworkUrl(item);

	if (artworkUrl) {
		return artworkUrl
			.replace("{w}", size.toString())
			.replace("{h}", size.toString());
	}

	return `/placeholder.svg?height=${size}&width=${size}`;
}

export function getDuration(item: MusicKit.Resource): number {
	// Return duration in seconds, default to 180 seconds (3 minutes) if not available
	return item.attributes.durationInMillis
		? Math.floor(item.attributes.durationInMillis / 1000)
		: 180;
}

export function getArtistName(item: MusicKit.Resource): string {
	return (
		item.attributes.artistName ||
		item.attributes.curatorName ||
		"Unknown Artist"
	);
}

// Add a utility function for throttling requests
async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRandomSongs(
	recommendations: MusicKit.PersonalRecommendation[],
	musicKit: MusicKit.MusicKitInstance,
	count: number = 50,
): Promise<MusicKit.Songs[]> {
	// Extract all content items from recommendations
	const allContentItems: Array<{ id: string; type: string; href: string }> = [];

	for (const recommendation of recommendations) {
		const contents = recommendation.relationships?.contents;
		if (contents && Array.isArray(contents)) {
			// Handle array case (original type definition)
			for (const contentRelationship of contents) {
				if (contentRelationship.data) {
					for (const contentItem of contentRelationship.data) {
						if (
							contentItem.type === "albums" ||
							contentItem.type === "playlists"
						) {
							allContentItems.push({
								id: contentItem.id,
								type: contentItem.type,
								href: contentItem.href,
							});
						}
					}
				}
			}
		} else if (contents && (contents as any).data) {
			// Handle single object case (actual API response)
			for (const contentItem of (contents as any).data) {
				if (contentItem.type === "albums" || contentItem.type === "playlists") {
					allContentItems.push({
						id: contentItem.id,
						type: contentItem.type,
						href: contentItem.href,
					});
				}
			}
		}
	}

	// Randomly shuffle and pick items to process
	const shuffled = [...allContentItems].sort(() => Math.random() - 0.5);

	// Limit API requests to a reasonable number (e.g., 10-15 items should give us enough songs)
	const selectedItems = shuffled.slice(
		0,
		Math.min(count, allContentItems.length),
	);

	// Process items in small batches to balance speed and rate limiting
	const allSongs: MusicKit.Songs[] = [];
	const batchSize = 3; // Process 3 items at a time

	for (let i = 0; i < selectedItems.length; i += batchSize) {
		const batch = selectedItems.slice(i, i + batchSize);

		// Process batch in parallel
		const batchPromises = batch.map(async (item) => {
			try {
				let songs: MusicKit.Songs[] = [];

				if (item.type === "albums") {
					// Try with include parameter to get tracks
					const { data } = (await musicKit.api.music(item.href)) as any;

					console.log(`🎵 Album API response for ${item.id}:`, data);

					// The actual album data is in response.data[0]
					const album = data?.data[0] as MusicKit.Albums;
					console.log(
						"🚀\x1b[5m\x1b[32m ~ DM\x1b[0m\x1b[36m ~ musicUtils.ts:149 ~ getRandomSongs ~ album\x1b[0m",
						album,
					);

					songs = (album?.relationships?.tracks?.data?.filter(
						(track) => track.type === "songs",
					) || []) as MusicKit.Songs[];
				} else if (item.type === "playlists") {
					// Try with include parameter to get tracks
					const { data } = (await musicKit.api.music(item.href, {
						include: ["tracks"],
					})) as any;

					console.log(`🎵 Playlist API response for ${item.id}:`, data);

					// The actual playlist data is in response.data[0]
					const playlist = data?.data[0] as MusicKit.Playlists;

					songs = (playlist?.relationships?.tracks?.data?.filter(
						(track) => track.type === "songs",
					) || []) as MusicKit.Songs[];
				}

				console.log(
					`🎵 Got ${songs.length} songs from ${item.type}: ${item.id}`,
				);
				return songs;
			} catch (error) {
				console.warn(
					`Failed to fetch details for ${item.type} ${item.id}:`,
					error,
				);
				return [];
			}
		});

		// Wait for batch to complete
		const batchResults = await Promise.all(batchPromises);
		allSongs.push(...batchResults.flat());

		// If we have enough songs, we can stop early
		if (allSongs.length >= count) {
			console.log(`🎵 Got enough songs (${allSongs.length}), stopping early`);
			break;
		}

		// Small delay between batches (reduced from 150ms to 50ms)
		if (i + batchSize < selectedItems.length) {
			await delay(50);
		}
	}

	console.log("🎵 Total songs collected:", allSongs.length);

	// Randomly shuffle and return the requested number of songs
	const shuffledSongs = [...allSongs].sort(() => Math.random() - 0.5);
	const result = shuffledSongs.slice(0, count);

	console.log("🎵 Final result:", result.length, "songs");
	return result;
}

export interface FetchRecommendationsOptions {
	musicKit: MusicKit.MusicKitInstance;
	handleApiError: (error: any) => Promise<void>;
}

export interface FetchRecommendationsResult {
	recommendedItems: MusicKit.Songs[];
	error: string | null;
}

export async function fetchRecommendations({
	musicKit,
	handleApiError,
}: FetchRecommendationsOptions): Promise<FetchRecommendationsResult> {
	try {
		const res = (await musicKit.api.music("/v1/me/recommendations", {
			include: [],
		})) as {
			data: { data: MusicKit.PersonalRecommendation[] };
		};

		// Get enriched recommendation items
		const randomSongs = await getRandomSongs(res.data.data, musicKit, 50);

		console.debug(
			"🚀\x1b[5m\x1b[32m ~ DM\x1b[0m\x1b[36m ~ fetchRecommendations ~ enrichedItems\x1b[0m",
			randomSongs,
		);

		return {
			recommendedItems: randomSongs,
			error: null,
		};
	} catch (err: any) {
		console.error("Failed to fetch recommendations:", err);

		// Handle authentication errors through the context
		if (err.status === 401 || err.status === 403) {
			await handleApiError(err);
			return {
				recommendedItems: [],
				error: "Authentication expired. Please sign in again.",
			};
		} else {
			return {
				recommendedItems: [],
				error: `Failed to fetch recommendations: ${err.message || "Unknown error"}`,
			};
		}
	}
}
