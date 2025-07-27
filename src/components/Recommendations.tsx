import React, { useEffect, useState, useCallback } from 'react';
import { useMusicKit } from '@/contexts/MusicKitContext';

import { getDuration, getRandomSongs } from '@/utils/musicUtils';
import DurationStep from './DurationStep';
import CompleteStep from './CompleteStep';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import SwipeInterface from './SwipeInterface';

const Recommendations: React.FC = () => {
  const { musicKit, isAuthorized, handleApiError } = useMusicKit();
  const [step, setStep] = useState<"duration" | "swipe" | "complete">("duration")
  const [targetDuration, setTargetDuration] = useState([30]) // in minutes
  const [recommendations, setRecommendations] = useState<MusicKit.Resource[]>([]);
  const [selectedItems, setSelectedItems] = useState<MusicKit.Resource[]>([])
  const [totalDuration, setTotalDuration] = useState(0)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const targetSeconds = targetDuration[0] * 60

  useEffect(() => {
    if (totalDuration >= targetSeconds && selectedItems.length > 0) {
      setStep("complete")
    }
  }, [totalDuration, targetSeconds, selectedItems.length])

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (musicKit && isAuthorized) {
        setLoading(true);
        setError(null);
        try {
          const res = await musicKit.api.music('/v1/me/recommendations', { include: [] }) as { data: { data: MusicKit.PersonalRecommendation[] } };

          // Filter to randomly select 50 songs
          const filteredSongs = getRandomSongs(res.data.data, 50);

          console.debug("🚀\x1b[5m\x1b[32m ~ DM\x1b[0m\x1b[36m ~ fetchRecommendations ~ filteredSongs\x1b[0m", filteredSongs)

          setRecommendations(filteredSongs);
          setRetryCount(0); // Reset retry count on success
        } catch (err: any) {
          console.error('Failed to fetch recommendations:', err);

          // Handle authentication errors through the context
          if (err.status === 401 || err.status === 403) {
            await handleApiError(err);
            setError('Authentication expired. Please sign in again.');
          } else {
            setError(`Failed to fetch recommendations: ${err.message || 'Unknown error'}`);
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Clear recommendations when not authorized
        setRecommendations([]);
        setError(null);
      }
    };

    if (step === "swipe") {
      fetchRecommendations();
    }
  }, [musicKit, isAuthorized, retryCount, step]); // Removed handleApiError from dependencies

  // Function to retry fetching recommendations
  const retryFetch = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleSwipe = useCallback((direction: "left" | "right", item: MusicKit.Resource) => {
    if (direction === "right") {
      setSelectedItems((prev) => [...prev, item]);
      setTotalDuration((prev) => prev + getDuration(item));
    }
  }, []); // Remove selectedItems.length dependency

  const resetPlaylist = useCallback(() => {
    setSelectedItems([])
    setTotalDuration(0)
    setStep("swipe")
  }, []);

  const handleDurationNext = useCallback(() => {
    setStep("swipe");
  }, []);

  if (!isAuthorized) {
    return null;
  }

  if (step === "duration") {
    return (
      <DurationStep
        targetDuration={targetDuration}
        onDurationChange={setTargetDuration}
        onNext={handleDurationNext}
      />
    );
  }

  if (step === "complete") {
    return (
      <CompleteStep
        selectedItems={selectedItems}
        totalDuration={totalDuration}
        onReset={resetPlaylist}
      />
    );
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={retryFetch} />;
  }

  if (recommendations.length === 0) {
    return <EmptyState />;
  }

  return (
    <SwipeInterface
      recommendations={recommendations}
      selectedItems={selectedItems}
      totalDuration={totalDuration}
      targetSeconds={targetSeconds}
      onSwipe={handleSwipe}
    />
  );
};

export default Recommendations;