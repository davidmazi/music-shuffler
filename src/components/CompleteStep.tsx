import React from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { CheckCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CompleteStepProps {
    selectedItems: MusicKit.Resource[];
    totalDuration: number;
    onReset: () => void;
    playlistName?: string;
}

const CompleteStep: React.FC<CompleteStepProps> = ({
    selectedItems,
    totalDuration,
    onReset,
    playlistName = "Your Shuffled Playlist"
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <GlassCard>
                <CardContent className="p-8 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                    <h2 className="text-white text-2xl font-semibold mb-2">Playlist Created!</h2>
                    <p className="text-white/60 mb-6">
                        "{playlistName}" has been successfully created in your Apple Music library.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={onReset}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            Create Another
                        </Button>
                    </div>
                </CardContent>
            </GlassCard>
        </div>
    );
};

export default CompleteStep;