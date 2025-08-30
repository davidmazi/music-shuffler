import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, RotateCcw, Music } from "lucide-react"
import { formatTime } from '@/utils/musicUtils';
import { Progress, ProgressTrack } from '@/components/animate-ui/base/progress';

interface ProgressHeaderProps {
    totalDuration: number;
    targetSeconds: number;
    selectedItemsCount: number;
    onReset: () => void;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
    totalDuration,
    targetSeconds,
    selectedItemsCount,
    onReset
}) => {
    const progress = (totalDuration / targetSeconds) * 100;

    return (
        <div className="text-center mb-8 pt-8 animate-slide-up">
            {/* Progress Stats */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-2xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                        <div className="text-sm text-muted-foreground">Duration</div>
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

                    {/* Progress Percentage */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <Badge
                            variant="secondary"
                            className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-medium"
                        >
                            {Math.round(progress)}%
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Selected Items */}
            <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl">
                    <Music className="w-4 h-4 text-brand-primary" />
                    <Badge
                        variant="secondary"
                        className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-medium"
                    >
                        {selectedItemsCount} items selected
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default ProgressHeader;