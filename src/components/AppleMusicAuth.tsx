import React from 'react';
import { useMusicKit } from '@/contexts/MusicKitContext';
import { Music, Loader2, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { RippleButton } from '@/components/animate-ui/buttons/ripple';

const AppleMusicAuth: React.FC = () => {
  const { error, authorize, musicKit, isLoading, isAuthenticating } = useMusicKit();
  const [isWaiting, setIsWaiting] = React.useState(false);

  const handleAuthorize = () => {
    setIsWaiting(true);
    // Add a small delay to let the ripple animation flow
    setTimeout(() => {
      authorize();
    }, 300);
  };

  const handleRetry = () => {
    // Add a small delay to let the ripple animation flow
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center"
        >
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </motion.div>
        <p className="text-muted-foreground">Loading MusicKit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
          <Music className="w-8 h-8 text-white" />
        </div>
        <p className="text-red-400 font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!musicKit) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-muted to-muted-foreground rounded-2xl flex items-center justify-center">
          <Music className="w-8 h-8 text-white" />
        </div>
        <p className="text-muted-foreground">MusicKit not available</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto bg-gradient-to-br from-brand-primary via-brand-primary-light to-brand-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/25"
        >
          <Music className="w-10 h-10 text-white" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-card-foreground mb-2">Welcome to Music Shuffler</h2>
          <p className="text-muted-foreground">Connect your Apple Music account to get started</p>
        </div>
      </div>

      {/* Auth Button */}
      <RippleButton
        onClick={isWaiting ? handleRetry : handleAuthorize}
        variant="default"
        className="w-full font-semibold py-4 rounded-xl shadow-lg "
        disabled={isAuthenticating}
        size="lg"
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Signing In...
          </>
        ) : isWaiting ? (
          <>
            <RefreshCcw className="w-5 h-5 mr-2 animate-pop-in-delayed" />
            Please wait while you are being authenticated
          </>
        ) : (
          <>
            <Music className="w-5 h-5 mr-2" />
            Sign In with Apple Music
          </>
        )}
      </RippleButton>

      {/* Info */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Your music library and preferences will be used to create personalized playlists
        </p>
      </div>
    </motion.div>
  );
};

export default AppleMusicAuth;