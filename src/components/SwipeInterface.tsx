import React, { useRef, useState, useEffect } from 'react';

import ProgressHeader from './ProgressHeader';
import SwipeCards, { type SwipeCardRef } from './SwipeCards';
import { type EnrichedRecommendationItem } from '@/utils/musicUtils';
import LoadingState from './LoadingState';

interface SwipeInterfaceProps {
    recommendations: EnrichedRecommendationItem[];
    selectedItems: EnrichedRecommendationItem[];
    totalDuration: number;
    targetSeconds: number;
    onSwipe: (direction: "left" | "right", item: EnrichedRecommendationItem) => void;
    loading: boolean;
    onReset: () => void;
    onFetchMore: () => Promise<void>;
    swipedCount: number;
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({
    recommendations,
    selectedItems,
    totalDuration,
    targetSeconds,
    loading,
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

            {/* Apple Music Playback Controls */}
            {React.createElement('apple-music-playback-controls', {
                className: 'self-center',
                ref: (element) => {
                    if (element) {
                        // Hide unwanted elements after the component renders
                        setTimeout(() => {
                            try {
                                const shadowRoot = element.shadowRoot;
                                if (shadowRoot) {
                                    // Hide previous button
                                    const previousBtn = shadowRoot.querySelector("div > div.music-controls__main > amp-playback-controls-item-skip.previous");
                                    if (previousBtn) {
                                        (previousBtn as HTMLElement).style.display = 'none';
                                    }

                                    // Hide next button
                                    const nextBtn = shadowRoot.querySelector("div > div.music-controls__main > amp-playback-controls-item-skip.next");
                                    if (nextBtn) {
                                        (nextBtn as HTMLElement).style.display = 'none';
                                    }

                                    // Hide shuffle button
                                    const shuffleBtn = shadowRoot.querySelector("div > div:nth-child(1) > amp-playback-controls-shuffle");
                                    if (shuffleBtn) {
                                        (shuffleBtn as HTMLElement).style.display = 'none';
                                    }

                                    // Hide repeat button
                                    const repeatBtn = shadowRoot.querySelector("div > div:nth-child(3) > amp-playback-controls-repeat");
                                    if (repeatBtn) {
                                        (repeatBtn as HTMLElement).style.display = 'none';
                                    }
                                }
                            } catch (error) {
                                console.warn('Could not hide playback control elements:', error);
                            }
                        }, 100); // Small delay to ensure component is fully rendered
                    }
                }
            })}


            {/* Card Stack - Give proper height for cards */}
            <div className="flex-1 flex items-center justify-center px-6 mb-10">
                {loading ? <LoadingState /> : <SwipeCards
                    key="swipe-cards-stable"
                    ref={swipeCardRef}
                    recommendations={stableRecommendations}
                    onSwipe={onSwipe}
                />}

            </div>

        </div>
    );
};

export default SwipeInterface;