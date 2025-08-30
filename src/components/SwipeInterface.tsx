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
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({
    recommendations,
    selectedItems,
    totalDuration,
    targetSeconds,
    onSwipe,
    onReset
}) => {
    const swipeCardRef = useRef<SwipeCardRef>(null);



    // Stable intermediary array that only updates when we get new recommendations
    const [stableRecommendations, setStableRecommendations] = useState<EnrichedRecommendationItem[]>([]);

    // Only update when we actually get new recommendations (not on every parent re-render)
    useEffect(() => {
        if (recommendations.length > 0 && stableRecommendations.length === 0) {
            setStableRecommendations(recommendations);
        }
    }, [recommendations, stableRecommendations.length]);

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