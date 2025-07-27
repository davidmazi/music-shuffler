import React from 'react';
import { GlassCard, CardContent } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <GlassCard className="w-full max-w-md">
                <CardContent className="p-8 text-center space-y-4">
                    <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
                    <h2 className="text-white text-xl font-semibold">Something went wrong</h2>
                    <p className="text-white/60 text-sm">{error}</p>
                    <Button
                        onClick={onRetry}
                        className="bg-gradient-to-r from-[#f94c57] to-pink-500 hover:from-[#e8434e] hover:to-pink-600 text-white"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </CardContent>
            </GlassCard>
        </div>
    );
};

export default ErrorState;