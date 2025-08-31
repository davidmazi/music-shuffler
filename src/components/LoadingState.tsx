import React from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { ClipLoader } from "react-spinners"
import { Bars } from "react-loader-spinner"

const LoadingState: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <GlassCard className="w-full h-full max-w-md">
                <CardContent className="flex justify-center p-8 text-center relative">

                    <Bars
                        height={60}
                        width={60}
                        color="var(--brand-primary)"
                        ariaLabel="bars-loading"
                        visible={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ClipLoader
                            color="var(--brand-secondary)"
                            size={100}
                            speedMultiplier={1}
                        />
                    </div>

                </CardContent>
            </GlassCard>
        </div>
    );
};

export default LoadingState;