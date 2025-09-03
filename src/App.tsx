import { GlassCard, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import AppleMusicAuth from "./components/AppleMusicAuth";
import Recommendations from "./components/Recommendations";
import ThemeToggle from "./components/ThemeToggle";

import { MusicKitProvider } from "./contexts/MusicKitContext";
import { useMusicKit } from "./contexts/MusicKitContext";
import "./index.css";
import { HoleBackground } from "./components/animate-ui/backgrounds/hole";

function AppContent() {
  const { isAuthorized, unauthorize, isAuthenticating } = useMusicKit();

  return (
    <div className="min-h-screen relative overflow-hidden w-full max-w-full">
      <HoleBackground
        className="fixed inset-0 flex items-center justify-center"
        strokeColor="hsl(262 83% 58%)"
        numberOfLines={60}
        numberOfDiscs={40}
        particleRGBColor={[168, 85, 247]}
      />

      {/* Theme Toggle */}
      <ThemeToggle />



      {/* Main content container */}
      <div className="relative z-10 min-h-screen">
        {/* Sleek sign out button */}
        {isAuthorized && (
          <Button
            onClick={unauthorize}
            disabled={isAuthenticating}
            variant="glass"
            className="fixed top-6 right-6 z-50 text-foreground hover:bg-glass-bg/80 transition-all duration-300"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isAuthenticating ? 'Signing Out...' : 'Sign Out'}
          </Button>
        )}

        {/* Main content */}
        {!isAuthorized ? (
          <div className="flex items-center justify-center min-h-screen p-6">
            <GlassCard
              variant="elevated"
              className="w-full max-w-md animate-fade-in"
            >
              <CardContent className="p-8">
                <AppleMusicAuth />
              </CardContent>
            </GlassCard>
          </div>
        ) : (
          <div className="animate-fade-in">
            <Recommendations />
          </div>
        )}
      </div>
    </div>
  );
}

export function App() {
  return (
    <MusicKitProvider>
      <AppContent />
    </MusicKitProvider>
  );
}

export default App;

