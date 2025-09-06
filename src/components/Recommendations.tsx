import React, { useEffect, useState, useCallback } from "react";
import { useMusicKit } from "@/contexts/MusicKitContext";

import {
	type EnrichedRecommendationItem,
	fetchRecommendations,
	getDuration,
} from "@/utils/musicUtils";
import DurationStep from "./DurationStep";
import CompleteStep from "./CompleteStep";
import EmptyState from "./EmptyState";
import SwipeInterface from "./SwipeInterface";

const Recommendations: React.FC = () => {
	const { musicKit, isAuthorized, handleApiError } = useMusicKit();
	const [step, setStep] = useState<"duration" | "swipe" | "complete">(
		"duration",
	);
	const [targetDuration, setTargetDuration] = useState([30]); // in minutes
	const [recommendations, setRecommendations] = useState<
		EnrichedRecommendationItem[]
	>([]);
	const [selectedItems, setSelectedItems] = useState<
		EnrichedRecommendationItem[]
	>([]);
	const [totalDuration, setTotalDuration] = useState(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [swipedCount, setSwipedCount] = useState<number>(0);

	const targetSeconds = targetDuration[0] * 60;

	useEffect(() => {
		if (totalDuration >= targetSeconds && selectedItems.length > 0) {
			setStep("complete");
		}
	}, [totalDuration, targetSeconds, selectedItems.length]);

	useEffect(() => {
		const fetchRecommendationsData = async () => {
			if (musicKit && isAuthorized) {
				setLoading(true);
				setError(null);

				const result = await fetchRecommendations({
					musicKit,
					handleApiError
				});

				if (result.error) {
					setError(result.error);
				} else {
					setRecommendations(result.recommendedItems);
				}

				setLoading(false);
			} else {
				// Clear recommendations when not authorized
				setRecommendations([]);
				setError(null);
			}
		};

		if (step === "swipe") {
			fetchRecommendationsData();
		}
	}, [musicKit, isAuthorized, step, handleApiError]);



	const handleSwipe = useCallback(
		async (direction: "left" | "right", item: EnrichedRecommendationItem) => {


			// Increment swiped count
			setSwipedCount(prev => prev + 1);

			if (direction === "right") {
				setSelectedItems((prev) => [...prev, item]);
				// For now, we'll use a default duration since we don't have individual song durations yet
				// This will be updated when we flatten the songs from albums/playlists
				setTotalDuration((prev) => prev + getDuration(item));
			}

			// Find song that was just swiped, when swiping too fast the .skipToNextItem() function 
			if (musicKit?.isPlaying) {
				try {
					musicKit.repeatMode = 0;

					const queueItems = musicKit.queue.items
					const currentSongIndexInQueue = queueItems.findIndex((queueItem) => queueItem.id === item.id)
					await musicKit.changeToMediaAtIndex(currentSongIndexInQueue + 1)

					musicKit.repeatMode = 1;
				} catch (error) {
					console.error('Failed to skip to next item:', error);
				}
			}

		},
		[musicKit],
	);

	const resetPlaylist = useCallback(() => {
		musicKit.stop()
		setSelectedItems([]);
		setRecommendations([]);
		setTotalDuration(0);
		setStep("duration");
		setSwipedCount(0);
	}, [musicKit]);

	const fetchMoreRecommendations = useCallback(async () => {
		// Fetch new recommendations and append them to existing ones
		if (musicKit && isAuthorized) {
			setLoading(true);
			setError(null);

			const result = await fetchRecommendations({
				musicKit,
				handleApiError
			});



			if (result.error) {
				setError(result.error);
			} else {
				setSwipedCount(0);
				setRecommendations(result.recommendedItems);
			}

			setLoading(false);
		}
	}, [musicKit, isAuthorized, handleApiError]);

	const handleDurationNext = useCallback(() => {
		setStep("swipe");
	}, []);

	if (!isAuthorized) {
		return null;
	}

	if (step === "duration") {
		return (
			<DurationStep
				targetDuration={targetDuration}
				onDurationChange={setTargetDuration}
				onNext={handleDurationNext}
			/>
		);
	}

	if (step === "complete") {
		return <CompleteStep onReset={resetPlaylist} selectedItems={selectedItems} />;
	}

	if (!loading && recommendations.length === 0) {
		return <EmptyState />;
	}

	return (
		<SwipeInterface
			loading={loading}
			recommendations={recommendations}
			totalDuration={totalDuration}
			targetSeconds={targetSeconds}
			onSwipe={handleSwipe}
			onReset={resetPlaylist}
			onFetchMore={fetchMoreRecommendations}
			swipedCount={swipedCount}
		/>
	);
};

export default Recommendations;
