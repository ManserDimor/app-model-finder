import { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/store/useStore";
import { dbOperations } from "@/lib/dbOperations";

/**
 * Hook that syncs user data between the database and Zustand store
 * - Fetches user data from database on login
 * - Persists changes to database when user is authenticated
 */
export const useUserDataSync = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    setWatchHistory, 
    setLikedVideos, 
    setSubscriptions,
    watchHistory,
    likedVideos,
    subscriptions,
  } = useStore();

  // Fetch user data from database on login
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchData = async () => {
        const userData = await dbOperations.fetchAllUserData(user.id);
        setWatchHistory(userData.watchHistory);
        setLikedVideos(userData.likedVideos);
        setSubscriptions(userData.subscriptions);
      };
      fetchData();
    }
  }, [isAuthenticated, user?.id, setWatchHistory, setLikedVideos, setSubscriptions]);

  // Database-synced operations
  const addToWatchHistoryDb = useCallback(async (videoId: string) => {
    if (!user) return;
    await dbOperations.addToWatchHistory(user.id, videoId);
  }, [user]);

  const likeVideoDb = useCallback(async (videoId: string) => {
    if (!user) return false;
    return await dbOperations.likeVideo(user.id, videoId);
  }, [user]);

  const unlikeVideoDb = useCallback(async (videoId: string) => {
    if (!user) return false;
    return await dbOperations.unlikeVideo(user.id, videoId);
  }, [user]);

  const subscribeDb = useCallback(async (channelId: string) => {
    if (!user) return false;
    return await dbOperations.subscribe(user.id, channelId);
  }, [user]);

  const unsubscribeDb = useCallback(async (channelId: string) => {
    if (!user) return false;
    return await dbOperations.unsubscribe(user.id, channelId);
  }, [user]);

  return {
    addToWatchHistoryDb,
    likeVideoDb,
    unlikeVideoDb,
    subscribeDb,
    unsubscribeDb,
  };
};
