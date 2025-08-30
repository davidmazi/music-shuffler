import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, RotateCcw, Music } from "lucide-react"
import { formatTime } from '@/utils/musicUtils';
import { Progress, ProgressTrack } from '@/components/animate-ui/base/progress';

interface ProgressHeaderProps {
    totalDuration: number;
    targetSeconds: number;
    onReset: () => void;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
    totalDuration,
    targetSeconds,
    onReset
}) => {
    const progress = (totalDuration / targetSeconds) * 100;

    return (
        <div className="text-center pt-8 animate-slide-up">
            {/* Progress Stats */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-2xl">
                    <Music className="w-8 h-8 text-brand-secondary" />

                    <div className="text-left">
                        <div className="text-foreground font-semibold">
                            {formatTime(totalDuration * 1000)} / {formatTime(targetSeconds * 1000)}
                        </div>
                    </div>
                </div>

                <Button
                    variant="glass"
                    size="icon"
                    onClick={onReset}
                    className="text-foreground hover:bg-glass-bg/80 transition-all duration-300"
                >
                    <RotateCcw className="w-4 h-4" />
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-6">
                <div className="relative">
                    <Progress
                        value={Math.min(progress, 100)}
                        className="w-full h-3"
                    >
                        <ProgressTrack className="bg-muted/30 h-3 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-brand-primary via-brand-primary-light to-brand-secondary rounded-full transition-all duration-500 ease-out shadow-lg shadow-brand-primary/25" />
                        </ProgressTrack>
                    </Progress>
                </div>
            </div>
        </div>
    );
};

export default ProgressHeader;