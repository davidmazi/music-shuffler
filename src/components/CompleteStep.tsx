import React, { useCallback } from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { CheckCircle, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useMusicKit } from "@/contexts/MusicKitContext"
import { type EnrichedRecommendationItem, createPlaylist } from "@/utils/musicUtils"

interface CompleteStepProps {
    onReset: () => void;
    playlistName?: string;
    selectedItems: EnrichedRecommendationItem[];
}

const CompleteStep: React.FC<CompleteStepProps> = ({
    onReset,
    playlistName = "RockMyRide",
    selectedItems
}) => {
    const { musicKit, handleApiError } = useMusicKit();

    const handleAddToLibrary = useCallback(async () => {
        if (!musicKit || selectedItems.length === 0) {
            console.error('MusicKit not available or no items selected');
            return;
        }

        try {
            const result = await createPlaylist({
                musicKit,
                handleApiError,
                playlistName,
                selectedItems,
            });

            if (result.success) {
                // Show success message
                window.alert(`Playlist "${playlistName}" created successfully with ${selectedItems.length} songs!`);
            } else {
                // Show error message
                window.alert(result.error);
            }

        } catch (error) {
            console.error('Failed to create playlist:', error);
            await handleApiError(error);
        }
    }, [musicKit, selectedItems, playlistName, handleApiError]);

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-lg"
            >
                <GlassCard variant="elevated" className="rounded-2xl">
                    <CardContent className="p-10 text-center">
                        {/* Header with Checkmark */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-3 mb-6"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25"
                            >
                                <CheckCircle className="w-6 h-6 text-white" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-card-foreground">
                                <span className="font-semibold text-card-foreground">{playlistName}</span>
                            </h2>
                        </motion.div>

                        {/* Success Message */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-muted-foreground mb-10 leading-relaxed"
                        >
                            is ready to be added to your Apple Music library!
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button
                                onClick={handleAddToLibrary}
                                variant="brand"
                                className="font-semibold flex-1 sm:flex-none"
                                size="lg"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add to Library
                            </Button>
                            <Button
                                onClick={onReset}
                                variant="outline"
                                className="font-semibold flex-1 sm:flex-none"
                                size="lg"
                            >
                                <RotateCcw className="w-5 h-5 mr-2" />
                                Create Another
                            </Button>
                        </motion.div>
                    </CardContent>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default CompleteStep;