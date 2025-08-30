import React, { useState, useRef, useEffect } from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Sparkles, Headphones, Clock } from "lucide-react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useAnimation } from "framer-motion"
import { CountingNumber } from "@/components/animate-ui/text/counting-number"




interface DurationStepProps {
    targetDuration: number[];
    onDurationChange: (value: number[]) => void;
    onNext: () => void;
}

const DurationStep: React.FC<DurationStepProps> = ({
    targetDuration,
    onDurationChange,
    onNext
}) => {
    // Animation states and refs
    const [isDragging, setIsDragging] = useState(false);
    const [previousDuration, setPreviousDuration] = useState(targetDuration[0]);
    const buttonRef = useRef<any>(null);
    const sliderRef = useRef<any>(null);

    // Motion values for smooth animations
    const sliderValue = useMotionValue(targetDuration[0]);
    const springValue = useSpring(sliderValue, {
        stiffness: 300,
        damping: 30,
        mass: 0.8
    });

    // Transform values for dynamic effects
    const knobScale = useTransform(springValue, [15, 120], [1, 1.2]);
    const knobGlow = useTransform(springValue, [15, 120], [0, 1]);
    const labelScale = useTransform(springValue, [15, 25], [1, 1.3]);
    const labelScaleMax = useTransform(springValue, [110, 120], [1, 1.3]);

    // Animation controls
    const numberAnimation = useAnimation();
    const backgroundAnimation = useAnimation();

    // Update motion value when duration changes
    useEffect(() => {
        sliderValue.set(targetDuration[0]);

        // Animate number change with bounce effect
        if (targetDuration[0] !== previousDuration) {
            numberAnimation.start({
                scale: [1, 1.1, 0.95, 1],
                transition: {
                    duration: 0.4,
                    ease: "easeOut"
                }
            });
            setPreviousDuration(targetDuration[0]);
        }
    }, [targetDuration[0], previousDuration, sliderValue, numberAnimation]);

    // Handle slider interaction
    const handleSliderChange = (value: number[]) => {
        onDurationChange(value);
        setIsDragging(true);
    };

    const handleSliderEnd = () => {
        setIsDragging(false);
    };

    // Handle start button interaction
    const handleStartClick = () => {
        // Animate button with pop effect
        if (buttonRef.current) {
            buttonRef.current.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (buttonRef.current) {
                    buttonRef.current.style.transform = 'scale(1)';
                }
            }, 150);
        }

        // Proceed to next step
        setTimeout(() => {
            onNext();
        }, 300);
    };

    // Ambient background animation
    useEffect(() => {
        backgroundAnimation.start({
            rotate: [0, 360],
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        });
    }, [backgroundAnimation]);

    return (
        <div className="flex items-center justify-center min-h-screen p-6 relative overflow-hidden">
            {/* Ambient Background Animation */}
            <motion.div
                animate={backgroundAnimation}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-brand-secondary/10 to-brand-primary/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-full blur-2xl" />
            </motion.div>



            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <GlassCard variant="elevated">
                        <CardContent className="p-8">
                            {/* Animated Duration Display */}
                            <div className="text-center mb-8">
                                <motion.div
                                    animate={numberAnimation}
                                    className="text-6xl font-bold mb-8"
                                >
                                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                        <CountingNumber
                                            number={targetDuration[0]}
                                            className="text-6xl font-bold bg-clip-text text-transparent"
                                        />
                                        <span className="ml-2">min</span>
                                    </span>
                                </motion.div>
                            </div>

                            {/* Enhanced Slider Section */}
                            <div className="mb-8 relative">
                                {/* Custom Slider Knob Glow Effect */}
                                <motion.div
                                    style={{ scale: knobScale, opacity: knobGlow }}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-brand-primary/30 rounded-full blur-md pointer-events-none"
                                />

                                <Slider
                                    ref={sliderRef}
                                    value={targetDuration}
                                    onValueChange={handleSliderChange}
                                    onValueCommit={handleSliderEnd}
                                    max={120}
                                    min={15}
                                    step={1}
                                    className="w-full relative z-10 h-8"
                                />


                            </div>

                            {/* Enhanced Start Button */}
                            <motion.button
                                ref={buttonRef}
                                onClick={handleStartClick}
                                className="w-full font-semibold py-4 px-6 rounded-xl relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                {/* Animated Background */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-purple-400/20"
                                    animate={{
                                        x: ["-100%", "100%"],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />

                                {/* Glow Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl"
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                {/* Content */}
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.div>
                                    <span>Start</span>
                                </div>
                            </motion.button>
                        </CardContent>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DurationStep;