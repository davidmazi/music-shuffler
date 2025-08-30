import React from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { GridLoader } from "react-spinners"

const LoadingState: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <GlassCard className="w-full max-w-md">
                <CardContent className="flex justify-center p-8 text-center">
                    <GridLoader
                        color="var(--brand-secondary)"
                        size={12}
                        margin={4}
                        speedMultiplier={0.8}
                    />
                </CardContent>
            </GlassCard>
        </div>
    );
};

export default LoadingState;