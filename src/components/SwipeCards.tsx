import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music } from "lucide-react";

import { getDisplayName, getArtworkUrl, getDuration, formatTime } from '@/utils/musicUtils';

interface SwipeCardProps {
    recommendations: MusicKit.Resource[];
    onSwipe: (direction: "left" | "right", item: MusicKit.Resource) => void;
}

export interface SwipeCardRef {
    swipeLeft: () => void;
    swipeRight: () => void;
}

// Helper functions for spring animations - exactly like the CodeSandbox
const to = (i: number) => ({
    x: 0,
    y: i * -4,
    scale: 1,
    rot: -10 + Math.random() * 20,
    delay: i * 100,
});

const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

// Transform function for 3D perspective - exactly like the CodeSandbox
const trans = (r: number, s: number) => {
    return `perspective(1500px) rotateX(20deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;
};

const SwipeCards = forwardRef<SwipeCardRef, SwipeCardProps>(({
    recommendations,
    onSwipe
}, ref) => {
    const [gone] = useState(() => new Set<number>()); // Track swiped cards

    // Create springs for all recommendations - exactly like the CodeSandbox
    const [props, api] = useSprings(recommendations.length, i => ({
        ...to(i),
        from: from(i),
    }));

    // Expose programmatic swipe methods
    useImperativeHandle(ref, () => ({
        swipeLeft: () => {
            // Find the first non-swiped card
            const currentIndex = recommendations.findIndex((_, index) => !gone.has(index));
            if (currentIndex !== -1) {
                gone.add(currentIndex);
                onSwipe("left", recommendations[currentIndex]);

                // Animate the card out to the left
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
            // Find the first non-swiped card
            const currentIndex = recommendations.findIndex((_, index) => !gone.has(index));
            if (currentIndex !== -1) {
                gone.add(currentIndex);
                onSwipe("right", recommendations[currentIndex]);

                // Animate the card out to the right
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

    // Create gesture handler - exactly like the CodeSandbox
    const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
        const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
        const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
        if (!down && trigger) {
            gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
            // Call parent callback with the swiped item
            onSwipe(dir > 0 ? "right" : "left", recommendations[index]);
        }
        api.start(i => {
            if (index !== i) return; // We're only interested in changing spring-data for the current spring
            const isGone = gone.has(index);
            const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
            const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
            const scale = down ? 1.1 : 1; // Active cards lift up a bit
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
                api.start(i => to(i));
            }, 600);
        }
    });

    // Render individual card content
    const renderCardContent = (item: MusicKit.Resource) => (
        <Card className="h-full bg-white/30 backdrop-blur-md border border-white/40 overflow-hidden shadow-2xl">
            <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-1 relative">
                    <div
                        className="w-full h-full bg-cover bg-center bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative"
                        style={{
                            backgroundImage: item.attributes.artwork ? `url(${getArtworkUrl(item)})` : undefined
                        }}
                    >
                        {item.attributes.artwork && (
                            <div className="absolute inset-0 bg-black/40"></div>
                        )}
                        {!item.attributes.artwork && (
                            <div className="text-center text-white p-6 relative z-10">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#f94c57]/30 to-pink-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <Music className="w-8 h-8 text-[#f94c57]" />
                                </div>
                                <h3 className="text-2xl font-bold">{getDisplayName(item)}</h3>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-6 bg-black/80 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-1">{getDisplayName(item)}</h3>
                    <p className="text-gray-200 mb-4">{item.attributes.artistName || item.type}</p>
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {formatTime(getDuration(item) * 1000)}
                        </Badge>
                        <Badge variant="secondary" className="bg-[#f94c57]/30 text-[#f94c57] border-[#f94c57]/40 capitalize">
                            {item.type}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
    return (
        <div className="relative w-full max-w-sm h-[500px] overflow-visible">
            {props.map(({ x, y, rot, scale }, i) => {
                const item = recommendations[i];
                if (!item) return null;

                return (
                    <animated.div
                        key={i}
                        className="absolute inset-0 will-change-transform"
                        style={{ x, y }}
                    >
                        {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
                        <animated.div
                            {...bind(i)}
                            className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
                            style={{
                                transform: interpolate([rot, scale], trans),
                            }}
                        >
                            {renderCardContent(item)}
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