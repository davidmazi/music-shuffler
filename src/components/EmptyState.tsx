import React from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { Music } from "lucide-react"

const EmptyState: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <GlassCard className="w-full max-w-md">
                <CardContent className="p-8 text-center">
                    <Music className="w-16 h-16 mx-auto mb-4 text-white/60" />
                    <h2 className="text-white text-xl font-semibold mb-2">No Recommendations Yet</h2>
                    <p className="text-white/60">Start by signing in with Apple Music to get personalized recommendations.</p>
                </CardContent>
            </GlassCard>
        </div>
    );
};

export default EmptyState;