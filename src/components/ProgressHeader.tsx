import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { motion } from "framer-motion"
import { formatTime } from '@/utils/musicUtils';

interface ProgressHeaderProps {
    totalDuration: number;
    targetSeconds: number;
    selectedItemsCount: number;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
    totalDuration,
    targetSeconds,
    selectedItemsCount
}) => {
    const progress = (totalDuration / targetSeconds) * 100;

    return (
        <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
                <Clock className="w-5 h-5 text-[#f94c57]" />
                <span className="text-white font-medium">
                    {formatTime(totalDuration * 1000)} / {formatTime(targetSeconds * 1000)}
                </span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
                <motion.div
                    className="bg-gradient-to-r from-[#f94c57] to-pink-500 h-3 rounded-full shadow-lg shadow-[#f94c57]/25"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-[#f94c57]/20 text-[#f94c57] border-[#f94c57]/30">
                    {selectedItemsCount} items
                </Badge>
            </div>
        </div>
    );
};

export default ProgressHeader;