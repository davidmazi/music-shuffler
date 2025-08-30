import React, { useRef, useState, useEffect } from 'react';

import ProgressHeader from './ProgressHeader';
import SwipeCard, { type SwipeCardRef } from './SwipeCards';
import { type EnrichedRecommendationItem } from '@/utils/musicUtils';

interface SwipeInterfaceProps {
    recommendations: EnrichedRecommendationItem[];
    selectedItems: EnrichedRecommendationItem[];
    totalDuration: number;
    targetSeconds: number;
    onSwipe: (direction: "left" | "right", item: EnrichedRecommendationItem) => void;
    onReset: () => void;
    onFetchMore: () => Promise<void>;
    swipedCount: number;
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({
    recommendations,
    selectedItems,
    totalDuration,
    targetSeconds,
    onSwipe,
    onReset,
    onFetchMore,
    swipedCount
}) => {
    const swipeCardRef = useRef<SwipeCardRef>(null);

    // Stable intermediary array that only updates when we get new recommendations
    const [stableRecommendations, setStableRecommendations] = useState<EnrichedRecommendationItem[]>([]);

    // Update stable recommendations when we get new ones
    useEffect(() => {
        if (recommendations.length > 0) {
            if (stableRecommendations.length === 0) {
                // First time - set initial recommendations
                setStableRecommendations(recommendations);
            } else if (recommendations.length > stableRecommendations.length) {
                // New recommendations added - update the stable array
                console.log(`📋 Updated stable recommendations: ${stableRecommendations.length} -> ${recommendations.length}`);
                setStableRecommendations(recommendations);
            }
        }
    }, [recommendations, stableRecommendations.length]);

    // Check if we need to fetch more recommendations
    // Fetch more when we've swiped through 5 items from the last fetched batch
    const [isFetching, setIsFetching] = useState(false);
    const [lastFetchTrigger, setLastFetchTrigger] = useState(0);

    useEffect(() => {

        // Only fetch if:
        // 1. We have no more items remaining (more conservative)
        // 2. We're not already fetching
        // 3. We have recommendations to work with
        // 4. We haven't triggered a fetch for this swipedCount yet
        // 5. We don't already have too many recommendations (cap at 50)
        if (stableRecommendations.length - swipedCount === 0 &&
            !isFetching &&
            stableRecommendations.length > 0 &&
            onFetchMore &&
            lastFetchTrigger !== swipedCount &&
            stableRecommendations.length < 50) {

            setIsFetching(true);
            setLastFetchTrigger(swipedCount);

            onFetchMore().finally(() => {
                setIsFetching(false);
            });
        }
    }, [swipedCount, stableRecommendations.length, onFetchMore, isFetching, lastFetchTrigger]);

    return (
        <div className="min-h-screen flex flex-col max-w-md mx-auto">
            {/* Header */}
            <div className="p-6">
                <ProgressHeader
                    totalDuration={totalDuration}
                    targetSeconds={targetSeconds}
                    onReset={onReset}
                />
            </div>

            {/* Card Stack - Give proper height for cards */}
            <div className="flex-1 flex items-center justify-center px-6 mb-10">
                <SwipeCard
                    key="swipe-cards-stable"
                    ref={swipeCardRef}
                    recommendations={stableRecommendations}
                    onSwipe={onSwipe}
                />
            </div>

        </div>
    );
};

export default SwipeInterface;