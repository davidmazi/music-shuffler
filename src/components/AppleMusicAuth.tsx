import React from 'react';
import { Button } from '@/components/ui/button';
import { useMusicKit } from '@/contexts/MusicKitContext';

const AppleMusicAuth: React.FC = () => {
  const { error, authorize, musicKit, isLoading, isAuthenticating } = useMusicKit();

  if (isLoading) {
    return <div className="text-center">Loading MusicKit...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!musicKit) {
    return <div className="text-center">MusicKit not available</div>;
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={authorize}
        className="w-full bg-gradient-to-r from-[#f94c57] to-pink-500 hover:from-[#e8434e] hover:to-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-[#f94c57]/25 transition-all duration-200 hover:shadow-[#f94c57]/40 hover:scale-[1.02]"
        disabled={isAuthenticating}
        size="lg"
      >
        {isAuthenticating ? 'Signing In...' : 'Sign In with Apple Music'}
      </Button>
    </div>
  );
};

export default AppleMusicAuth;