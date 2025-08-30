import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';
import { MusicCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Clock } from "lucide-react";

import { formatTime, type EnrichedRecommendationItem, getDisplayName, getArtworkUrl, getDuration, getArtistName, getGenre } from '@/utils/musicUtils';

interface SwipeCardProps {
    recommendations: EnrichedRecommendationItem[];
    onSwipe: (direction: "left" | "right", item: EnrichedRecommendationItem) => void;
}

export interface SwipeCardRef {
    swipeLeft: () => void;
    swipeRight: () => void;
}

// Helper functions for spring animations
const to = (i: number, totalCards: number) => {
    // Calculate a dynamic offset to ensure cards stay visible
    // When there are many cards, we need to position them higher
    const maxOffset = Math.min(totalCards * 4, 60); // Cap the maximum offset
    const baseOffset = totalCards > 10 ? -maxOffset / totalCards : -4;

    return {
        x: 0,
        y: i * baseOffset,
        scale: 1,
        rot: -10 + Math.random() * 20,
        delay: i * 100,
    };
};

const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

// Transform function for 3D perspective
const trans = (r: number, s: number) => {
    return `perspective(1500px) rotateX(20deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;
};

const SwipeCards = forwardRef<SwipeCardRef, SwipeCardProps>(({
    recommendations,
    onSwipe
}, ref) => {
    const [gone] = useState(() => new Set<number>());

    // Create springs for all recommendations
    const [props, api] = useSprings(recommendations.length, i => ({
        ...to(i, recommendations.length),
        from: from(i),
    }));

    // Expose programmatic swipe methods
    useImperativeHandle(ref, () => ({
        swipeLeft: () => {
            const currentIndex = recommendations.findIndex((_, index) => !gone.has(index));
            if (currentIndex !== -1) {
                gone.add(currentIndex);
                onSwipe("left", recommendations[currentIndex]);

                api.start(i => {
                    if (i !== currentIndex) return;
                    return {
                        x: -(200 + window.innerWidth),
                        rot: -10,
                        scale: 1,
                        delay: undefined,
                        config: { friction: 50, tension: 200 },
                    };
                });
            }
        },
        swipeRight: () => {
            const currentIndex = recommendations.findIndex((_, index) => !gone.has(index));
            if (currentIndex !== -1) {
                gone.add(currentIndex);
                onSwipe("right", recommendations[currentIndex]);

                api.start(i => {
                    if (i !== currentIndex) return;
                    return {
                        x: 200 + window.innerWidth,
                        rot: 10,
                        scale: 1,
                        delay: undefined,
                        config: { friction: 50, tension: 200 },
                    };
                });
            }
        }
    }), [recommendations, gone, onSwipe, api]);

    // Create gesture handler
    const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
        const trigger = velocity > 0.2;
        const dir = xDir < 0 ? -1 : 1;
        if (!down && trigger) {
            gone.add(index);
            onSwipe(dir > 0 ? "right" : "left", recommendations[index]);
        }
        api.start(i => {
            if (index !== i) return;
            const isGone = gone.has(index);
            const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
            const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0);
            const scale = down ? 1.1 : 1;
            return {
                x,
                rot,
                scale,
                delay: undefined,
                config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
            };
        });
        if (!down && gone.size === recommendations.length) {
            setTimeout(() => {
                gone.clear();
                api.start(i => to(i, recommendations.length));
            }, 600);
        }
    });

    // Render individual card content with sleek design
    const renderCardContent = (item: EnrichedRecommendationItem) => {
        const artworkUrl = getArtworkUrl(item);
        const displayName = getDisplayName(item);
        const artistName = getArtistName(item);
        const genre = getGenre(item);
        const duration = getDuration(item);

        return (
            <div className="h-full mb-1.5 overflow-hidden rounded-xl shadow-2xl">
                <div className="h-full flex flex-col">
                    {/* Artwork Section */}
                    <div className="flex-1 relative group">
                        <div
                            className="w-full h-full bg-cover bg-center relative overflow-hidden"
                            style={{
                                backgroundImage: artworkUrl ? `url(${artworkUrl})` : 'none'
                            }}
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Hover Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Fallback Icon */}
                            {!artworkUrl && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white p-6">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                                            <Music className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold">{displayName}</h3>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-6 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm border-t border-border/20">
                        <h3 className="text-xl font-bold text-card-foreground mb-1 line-clamp-1">
                            {displayName}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-1">
                            {genre}
                        </p>
                        <p className="text-muted-foreground mb-4 line-clamp-1">
                            {artistName}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-border/30">
                                    {formatTime(duration * 1000)}
                                </Badge>
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 capitalize font-medium"
                            >
                                {genre}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full max-w-sm h-[500px] overflow-visible">
            {props.map(({ x, y, rot, scale }, i) => {
                const item = recommendations[i];
                if (!item) return null;

                return (
                    <animated.div
                        key={item.id || i}
                        className="absolute inset-0 will-change-transform"
                        style={{ x, y }}
                    >
                        <animated.div
                            {...bind(i)}
                            className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
                            style={{
                                transform: interpolate([rot, scale], trans),
                            }}
                        >
                            <MusicCard className="h-full">
                                {renderCardContent(item)}
                            </MusicCard>
                        </animated.div>
                    </animated.div>
                );
            })}
        </div>
    );
});

// Memoize the component to prevent unnecessary re-renders
const MemoizedSwipeCards = React.memo(SwipeCards);

export default MemoizedSwipeCards;