import React from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { CheckCircle, Play, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface CompleteStepProps {
    onReset: () => void;
    playlistName?: string;
}

const CompleteStep: React.FC<CompleteStepProps> = ({
    onReset,
    playlistName = "RockMyRide"
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-md"
            >
                <GlassCard variant="elevated">
                    <CardContent className="p-8 text-center">
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25"
                        >
                            <CheckCircle className="w-10 h-10 text-white" />
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl font-bold text-card-foreground mb-3"
                        >
                            Playlist Created!
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-muted-foreground mb-8"
                        >
                            "{playlistName}" has been successfully created in your Apple Music library.
                        </motion.p>

                        {/* Playlist Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mb-8 p-4 glass-card rounded-xl border border-border/30"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                                    <Music className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-card-foreground">{playlistName}</div>
                                    <div className="text-sm text-muted-foreground">Ready to play</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                            className="flex flex-col sm:flex-row gap-3 justify-center"
                        >
                            <Button
                                onClick={onReset}
                                variant="brand"
                                className="font-semibold"
                                size="lg"
                            >
                                <Play className="w-4 h-4 mr-2" />
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