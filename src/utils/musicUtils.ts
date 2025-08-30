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

export function getGenre(item: MusicKit.Resource): string {
	return (
		item.attributes.genreNames?.filter((g) => g !== "Musique").join(", ") ||
		"Unknown Genre"
	);
}

// Add a utility function for throttling requests
async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRandomSongs(
	recommendations: MusicKit.PersonalRecommendation[],
	musicKit: MusicKit.MusicKitInstance,
	count: number,
): Promise<MusicKit.Songs[]> {
	// Extract all content items from recommendations with track counts
	const allContentItems: Array<{
		id: string;
		type: string;
		href: string;
		trackCount: number;
		contentHref: string; // The href to fetch individual tracks
	}> = [];

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
								trackCount: contentItem.attributes?.trackCount || 0,
								contentHref: contentItem.href,
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
						trackCount: contentItem.attributes?.trackCount || 0,
						contentHref: contentItem.href,
					});
				}
			}
		}
	}

	// Create song placeholders based on track counts
	const songPlaceholders: Array<{
		trackIndex: number;
		contentHref: string;
		type: string;
		contentId: string;
	}> = [];

	for (const item of allContentItems) {
		if (item.trackCount > 0) {
			for (let i = 0; i < item.trackCount; i++) {
				songPlaceholders.push({
					trackIndex: i,
					contentHref: item.contentHref,
					type: item.type,
					contentId: item.id,
				});
			}
		}
	}

	console.log(
		`🎵 Created ${songPlaceholders.length} song placeholders from ${allContentItems.length} content items`,
	);

	// Shuffle the song placeholders using Fisher-Yates algorithm
	const shuffledPlaceholders = [...songPlaceholders];
	for (let i = shuffledPlaceholders.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledPlaceholders[i], shuffledPlaceholders[j]] = [
			shuffledPlaceholders[j],
			shuffledPlaceholders[i],
		];
	}

	// Take only the number of songs we need
	const selectedPlaceholders = shuffledPlaceholders.slice(0, count);

	console.log(`🎵 Selected ${selectedPlaceholders.length} songs to fetch`);

	// Group placeholders by content to batch fetch efficiently
	const placeholdersByContent = new Map<
		string,
		Array<{
			trackIndex: number;
			contentHref: string;
			type: string;
			contentId: string;
		}>
	>();

	for (const placeholder of selectedPlaceholders) {
		const key = `${placeholder.type}-${placeholder.contentId}`;
		if (!placeholdersByContent.has(key)) {
			placeholdersByContent.set(key, []);
		}
		placeholdersByContent.get(key)!.push(placeholder);
	}

	// Fetch songs in batches
	const allSongs: MusicKit.Songs[] = [];
	const batchSize = 5; // Process 5 content items at a time
	const contentKeys = Array.from(placeholdersByContent.keys());

	for (let i = 0; i < contentKeys.length; i += batchSize) {
		const batchKeys = contentKeys.slice(i, i + batchSize);

		// Process batch in parallel
		const batchPromises = batchKeys.map(async (key) => {
			const placeholders = placeholdersByContent.get(key)!;
			const firstPlaceholder = placeholders[0];

			try {
				const songs: MusicKit.Songs[] = [];

				if (firstPlaceholder.type === "albums") {
					// Fetch album with tracks
					const { data } = (await musicKit.api.music(
						firstPlaceholder.contentHref,
						{
							include: ["tracks"],
						},
					)) as any;

					console.log(
						`🎵 Album API response for ${firstPlaceholder.contentId}:`,
						data,
					);

					// The actual album data is in response.data[0]
					const album = data?.data[0] as MusicKit.Albums;
					const allAlbumSongs = (album?.relationships?.tracks?.data?.filter(
						(track) => track.type === "songs",
					) || []) as MusicKit.Songs[];

					// Extract only the songs we need based on trackIndex
					for (const placeholder of placeholders) {
						if (allAlbumSongs[placeholder.trackIndex]) {
							songs.push(allAlbumSongs[placeholder.trackIndex]);
						}
					}
				} else if (firstPlaceholder.type === "playlists") {
					// Fetch playlist with tracks
					const { data } = (await musicKit.api.music(
						firstPlaceholder.contentHref,
						{
							include: ["tracks"],
						},
					)) as any;

					console.log(
						`🎵 Playlist API response for ${firstPlaceholder.contentId}:`,
						data,
					);

					// The actual playlist data is in response.data[0]
					const playlist = data?.data[0] as MusicKit.Playlists;
					const allPlaylistSongs =
						(playlist?.relationships?.tracks?.data?.filter(
							(track) => track.type === "songs",
						) || []) as MusicKit.Songs[];

					// Extract only the songs we need based on trackIndex
					for (const placeholder of placeholders) {
						if (allPlaylistSongs[placeholder.trackIndex]) {
							songs.push(allPlaylistSongs[placeholder.trackIndex]);
						}
					}
				}

				console.log(
					`🎵 Got ${songs.length} songs from ${firstPlaceholder.type}: ${firstPlaceholder.contentId}`,
				);
				return songs;
			} catch (error) {
				console.warn(
					`Failed to fetch details for ${firstPlaceholder.type} ${firstPlaceholder.contentId}:`,
					error,
				);
				return [];
			}
		});

		// Wait for batch to complete
		const batchResults = await Promise.all(batchPromises);
		allSongs.push(...batchResults.flat());

		// Small delay between batches
		if (i + batchSize < contentKeys.length) {
			await delay(50);
		}
	}

	console.log("🎵 Total songs collected:", allSongs.length);

	// Shuffle the final result to ensure randomness
	const result = [...allSongs].sort(() => Math.random() - 0.5).slice(0, count);

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
		const randomSongs = await getRandomSongs(res.data.data, musicKit, 20);

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
