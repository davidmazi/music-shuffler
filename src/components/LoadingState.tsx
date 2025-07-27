import React from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { Headphones } from "lucide-react"
import { motion } from "framer-motion"

const LoadingState: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <GlassCard className="w-full max-w-md">
                <CardContent className="p-8 text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#f94c57] to-pink-500 rounded-2xl flex items-center justify-center"
                    >
                        <Headphones className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-white text-lg">Loading your recommendations...</p>
                </CardContent>
            </GlassCard>
        </div>
    );
};

export default LoadingState;