import React from 'react';
import { Music } from "lucide-react"
import { motion } from "framer-motion"

import { getDisplayName, getArtworkUrl, getDuration, formatTime } from '@/utils/musicUtils';

interface PlaylistItemProps {
    item: MusicKit.Resource;
    index: number;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ item, index }) => {
    return (
        <motion.div
            key={`${item.id}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
        >
            <div className="w-12 h-12 bg-gradient-to-br from-[#f94c57]/20 to-pink-500/20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.attributes.artwork ? (
                    <img
                        src={getArtworkUrl(item, 48)}
                        alt={getDisplayName(item)}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <Music className="w-5 h-5 text-[#f94c57]" />
                )}
            </div>
            <div className="flex-1 text-left">
                <div className="text-white text-sm font-medium truncate">{getDisplayName(item)}</div>
                <div className="text-gray-400 text-xs truncate">{item.attributes.artistName || item.type}</div>
            </div>
            <div className="text-gray-400 text-xs">{formatTime(getDuration(item) * 1000)}</div>
        </motion.div>
    );
};

export default PlaylistItem;