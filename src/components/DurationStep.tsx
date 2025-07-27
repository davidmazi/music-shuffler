import React from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Sparkles, Headphones } from "lucide-react"
import { motion } from "framer-motion"

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
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm"
            >
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#f94c57] to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#f94c57]/25"
                    >
                        <Headphones className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3"
                    >
                        Music Shuffler
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-400 text-lg"
                    >
                        Create your perfect playlist
                    </motion.p>
                </div>

                {/* Main Card */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                    <GlassCard>
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f94c57]/20 to-pink-500/20 rounded-full mb-6">
                                    <Sparkles className="w-4 h-4 text-[#f94c57]" />
                                    <span className="text-[#f94c57] text-sm font-medium">Duration</span>
                                </div>
                                <p className="text-gray-300 mb-6">How long should your playlist be?</p>

                                <div className="text-6xl font-bold bg-gradient-to-r from-[#f94c57] to-pink-500 bg-clip-text text-transparent mb-8">
                                    {targetDuration[0]} min
                                </div>
                            </div>

                            <div className="mb-8">
                                <Slider
                                    value={targetDuration}
                                    onValueChange={onDurationChange}
                                    max={120}
                                    min={15}
                                    step={5}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-500 mt-3">
                                    <span>15 min</span>
                                    <span>120 min</span>
                                </div>
                            </div>

                            <Button
                                onClick={onNext}
                                className="w-full bg-gradient-to-r from-[#f94c57] to-pink-500 hover:from-[#e8434e] hover:to-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-[#f94c57]/25 transition-all duration-200 hover:shadow-[#f94c57]/40 hover:scale-[1.02]"
                                size="lg"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Start Building
                            </Button>
                        </CardContent>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DurationStep;