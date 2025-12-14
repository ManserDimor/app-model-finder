import { supabase } from "@/integrations/supabase/client";

// Database operations for user data - these use server-side storage with RLS protection

export const dbOperations = {
  // Watch History
  async addToWatchHistory(userId: string, videoId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("watch_history")
        .upsert(
          { user_id: userId, video_id: videoId, watched_at: new Date().toISOString() },
          { onConflict: "user_id,video_id" }
        );
      if (error) {
        console.error("Failed to save watch history:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to save watch history:", error);
      return false;
    }
  },

  async getWatchHistory(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("watch_history")
        .select("video_id")
        .eq("user_id", userId)
        .order("watched_at", { ascending: false })
        .limit(100);
      
      if (error) {
        console.error("Failed to fetch watch history:", error);
        return [];
      }
      return data?.map(item => item.video_id) || [];
    } catch (error) {
      console.error("Failed to fetch watch history:", error);
      return [];
    }
  },

  // Liked Videos
  async likeVideo(userId: string, videoId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("liked_videos")
        .insert({ user_id: userId, video_id: videoId });
      
      if (error) {
        // Ignore duplicate errors
        if (error.code === "23505") return true;
        console.error("Failed to like video:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to like video:", error);
      return false;
    }
  },

  async unlikeVideo(userId: string, videoId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("liked_videos")
        .delete()
        .eq("user_id", userId)
        .eq("video_id", videoId);
      
      if (error) {
        console.error("Failed to unlike video:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to unlike video:", error);
      return false;
    }
  },

  async getLikedVideos(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("liked_videos")
        .select("video_id")
        .eq("user_id", userId)
        .order("liked_at", { ascending: false });
      
      if (error) {
        console.error("Failed to fetch liked videos:", error);
        return [];
      }
      return data?.map(item => item.video_id) || [];
    } catch (error) {
      console.error("Failed to fetch liked videos:", error);
      return [];
    }
  },

  async isVideoLiked(userId: string, videoId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("liked_videos")
        .select("id")
        .eq("user_id", userId)
        .eq("video_id", videoId)
        .maybeSingle();
      
      if (error) {
        console.error("Failed to check if video is liked:", error);
        return false;
      }
      return !!data;
    } catch (error) {
      console.error("Failed to check if video is liked:", error);
      return false;
    }
  },

  // Subscriptions
  async subscribe(userId: string, channelId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .insert({ user_id: userId, channel_id: channelId });
      
      if (error) {
        // Ignore duplicate errors
        if (error.code === "23505") return true;
        console.error("Failed to subscribe:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to subscribe:", error);
      return false;
    }
  },

  async unsubscribe(userId: string, channelId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("user_id", userId)
        .eq("channel_id", channelId);
      
      if (error) {
        console.error("Failed to unsubscribe:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      return false;
    }
  },

  async getSubscriptions(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("channel_id")
        .eq("user_id", userId)
        .order("subscribed_at", { ascending: false });
      
      if (error) {
        console.error("Failed to fetch subscriptions:", error);
        return [];
      }
      return data?.map(item => item.channel_id) || [];
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      return [];
    }
  },

  async isSubscribed(userId: string, channelId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("channel_id", channelId)
        .maybeSingle();
      
      if (error) {
        console.error("Failed to check subscription:", error);
        return false;
      }
      return !!data;
    } catch (error) {
      console.error("Failed to check subscription:", error);
      return false;
    }
  },

  // Fetch all user data at once
  async fetchAllUserData(userId: string): Promise<{
    watchHistory: string[];
    likedVideos: string[];
    subscriptions: string[];
  }> {
    try {
      const [historyRes, likesRes, subsRes] = await Promise.all([
        supabase.from("watch_history").select("video_id").eq("user_id", userId).order("watched_at", { ascending: false }),
        supabase.from("liked_videos").select("video_id").eq("user_id", userId),
        supabase.from("subscriptions").select("channel_id").eq("user_id", userId),
      ]);

      return {
        watchHistory: historyRes.data?.map(item => item.video_id) || [],
        likedVideos: likesRes.data?.map(item => item.video_id) || [],
        subscriptions: subsRes.data?.map(item => item.channel_id) || [],
      };
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return { watchHistory: [], likedVideos: [], subscriptions: [] };
    }
  },
};
