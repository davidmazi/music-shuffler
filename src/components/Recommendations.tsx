import React, { useEffect, useState, useCallback } from "react";
import { useMusicKit } from "@/contexts/MusicKitContext";

import {
	type EnrichedRecommendationItem,
	fetchRecommendations,
} from "@/utils/musicUtils";
import DurationStep from "./DurationStep";
import CompleteStep from "./CompleteStep";
import LoadingState from "./LoadingState";

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

				const result = await fetchRecommendations({ musicKit, handleApiError });

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
	}, [musicKit, isAuthorized, step, handleApiError]); // Removed handleApiError from dependencies



	const handleSwipe = useCallback(
		(direction: "left" | "right", item: EnrichedRecommendationItem) => {
			if (direction === "right") {
				setSelectedItems((prev) => [...prev, item]);
				// For now, we'll use a default duration since we don't have individual song durations yet
				// This will be updated when we flatten the songs from albums/playlists
				setTotalDuration((prev) => prev + 180); // Default 3 minutes per item
			}
		},
		[],
	); // Remove selectedItems.length dependency

	const resetPlaylist = useCallback(() => {
		setSelectedItems([]);
		setRecommendations([]);
		setTotalDuration(0);
		setStep("duration");
	}, []);

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
		return <CompleteStep onReset={resetPlaylist} />;
	}

	if (loading) {
		return <LoadingState />;
	}


	if (recommendations.length === 0) {
		return <EmptyState />;
	}

	return (
		<SwipeInterface
			recommendations={recommendations}
			selectedItems={selectedItems}
			totalDuration={totalDuration}
			targetSeconds={targetSeconds}
			onSwipe={handleSwipe}
			onReset={resetPlaylist}
		/>
	);
};

export default Recommendations;
