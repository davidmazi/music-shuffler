import { GlassCard, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { BubbleBackground } from "@/components/animate-ui/backgrounds/bubble";
import AppleMusicAuth from "./components/AppleMusicAuth";
import Recommendations from "./components/Recommendations";
import { MusicKitProvider } from "./contexts/MusicKitContext";
import { useMusicKit } from "./contexts/MusicKitContext";
import "./index.css";

function AppContent() {
  const { isAuthorized, unauthorize, isAuthenticating } = useMusicKit();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden w-full max-w-full">
      {/* Animated background elements */}
      <BubbleBackground
        colors={{
          first: '249, 76, 87',    // #f94c57
          second: '236, 72, 153',  // pink-500
          third: '239, 68, 68',    // red-500
          fourth: '200, 50, 50',
          fifth: '180, 180, 50',
          sixth: '140, 100, 255'
        }}
        interactive={true}
        transition={{
          stiffness: 100,
          damping: 20
        }}
      />

      {/* Absolute positioned sign out button */}
      {isAuthorized && (
        <Button
          onClick={unauthorize}
          disabled={isAuthenticating}
          className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isAuthenticating ? 'Signing Out...' : 'Sign Out'}
        </Button>
      )}

      {/* Main content */}
      {!isAuthorized ? (
        <div className="flex items-center justify-center min-h-screen p-6">
          <GlassCard className="w-full max-w-md">
            <CardContent className="p-8">
              <AppleMusicAuth />
            </CardContent>
          </GlassCard>
        </div>
      ) : (
        <Recommendations />
      )}
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

