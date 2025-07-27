import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Heart, X } from "lucide-react"
import { motion } from "framer-motion"

import ProgressHeader from './ProgressHeader';
import SwipeCard, { type SwipeCardRef } from './SwipeCards';

interface SwipeInterfaceProps {
    recommendations: MusicKit.Resource[];
    selectedItems: MusicKit.Resource[];
    totalDuration: number;
    targetSeconds: number;
    onSwipe: (direction: "left" | "right", item: MusicKit.Resource) => void;
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({
    recommendations,
    selectedItems,
    totalDuration,
    targetSeconds,
    onSwipe
}) => {
    const swipeCardRef = useRef<SwipeCardRef>(null);



    // Stable intermediary array that only updates when we get new recommendations
    const [stableRecommendations, setStableRecommendations] = useState<MusicKit.Resource[]>([]);

    // Only update when we actually get new recommendations (not on every parent re-render)
    useEffect(() => {
        if (recommendations.length > 0 && stableRecommendations.length === 0) {
            setStableRecommendations(recommendations);
        }
    }, [recommendations, stableRecommendations.length]);

    return (
        <div className="min-h-screen flex flex-col max-w-md mx-auto">
            {/* Header */}
            <div className="p-6 pb-4">
                <ProgressHeader
                    totalDuration={totalDuration}
                    targetSeconds={targetSeconds}
                    selectedItemsCount={selectedItems.length}
                />
            </div>

            {/* Card Stack - Give proper height for cards */}
            <div className="flex-1 flex items-center justify-center px-6 min-h-[500px]">
                <SwipeCard
                    key="swipe-cards-stable"
                    ref={swipeCardRef}
                    recommendations={stableRecommendations}
                    onSwipe={onSwipe}
                />
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="mt-auto p-6 pt-0">
                <div className="flex justify-center gap-8 relative z-20">
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-16 h-16 rounded-2xl border-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 bg-transparent backdrop-blur-sm transition-all duration-200"
                            onClick={() => {
                                swipeCardRef.current?.swipeLeft();
                            }}
                        >
                            <X className="w-7 h-7" />
                        </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                            size="lg"
                            className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#f94c57] to-pink-500 hover:from-[#e8434e] hover:to-pink-600 text-white shadow-lg shadow-[#f94c57]/25 transition-all duration-200 hover:shadow-[#f94c57]/40"
                            onClick={() => {
                                swipeCardRef.current?.swipeRight();
                            }}
                        >
                            <Heart className="w-7 h-7" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SwipeInterface;