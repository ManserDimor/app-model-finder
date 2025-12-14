import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, Share2, ListPlus, Flag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoCard } from "@/components/video/VideoCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/contexts/AuthContext";
import { useUserDataSync } from "@/hooks/useUserDataSync";
import { useToast } from "@/hooks/use-toast";
import { commentSchema } from "@/lib/validation";

const formatViews = (views: number) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const { profile, isAuthenticated } = useAuth();
  const { addToWatchHistoryDb, likeVideoDb, subscribeDb, unsubscribeDb } = useUserDataSync();
  const {
    videos,
    comments,
    channels,
    subscriptions,
    likedVideos,
    updateVideoViews,
    likeVideo,
    dislikeVideo,
    subscribe,
    unsubscribe,
    addToWatchHistory,
    addComment,
  } = useStore();

  const video = videos.find((v) => v.id === id);
  const channel = channels.find((c) => c.id === video?.channelId);
  const videoComments = comments.filter((c) => c.videoId === id);
  const relatedVideos = videos.filter((v) => v.id !== id).slice(0, 10);
  const isSubscribed = channel && subscriptions.includes(channel.id);
  const isLiked = video && likedVideos.includes(video.id);

  useEffect(() => {
    if (video) {
      updateVideoViews(video.id);
      addToWatchHistory(video.id);
      // Also save to database if authenticated
      if (isAuthenticated) {
        addToWatchHistoryDb(video.id);
      }
    }
  }, [video?.id, isAuthenticated]);

  if (!video) {
    return (
      <Layout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Video not found</p>
        </div>
      </Layout>
    );
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({ title: "Please sign in to like videos" });
      return;
    }
    likeVideo(video.id);
    // Save to database
    await likeVideoDb(video.id);
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      toast({ title: "Please sign in to dislike videos" });
      return;
    }
    dislikeVideo(video.id);
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast({ title: "Please sign in to subscribe" });
      return;
    }
    if (!channel) return;
    if (isSubscribed) {
      unsubscribe(channel.id);
      await unsubscribeDb(channel.id);
      toast({ title: `Unsubscribed from ${channel.name}` });
    } else {
      subscribe(channel.id);
      await subscribeDb(channel.id);
      toast({ title: `Subscribed to ${channel.name}` });
    }
  };

  const handleComment = () => {
    if (!isAuthenticated || !profile) {
      toast({ title: "Please sign in to comment" });
      return;
    }
    
    const result = commentSchema.safeParse({ content: commentText });
    if (!result.success) {
      toast({ title: result.error.errors[0]?.message || "Invalid comment", variant: "destructive" });
      return;
    }

    addComment({
      id: `comment-${Date.now()}`,
      videoId: video.id,
      userId: profile.id,
      username: profile.username,
      userAvatar: profile.avatar_url || "",
      content: commentText.trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    });
    setCommentText("");
    toast({ title: "Comment added" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard" });
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-3">
          <VideoPlayer src={video.videoUrl} poster={video.thumbnailUrl} />

          <h1 className="mt-4 text-xl font-bold">{video.title}</h1>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to={`/channel/${channel?.id}`} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={video.channelAvatar} alt={video.channelName} />
                  <AvatarFallback>{video.channelName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{video.channelName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatViews(channel?.subscribers || 0)} subscribers
                  </p>
                </div>
              </Link>
              <Button
                variant={isSubscribed ? "secondary" : "default"}
                onClick={handleSubscribe}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-full bg-secondary">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`rounded-l-full ${isLiked ? "text-primary" : ""}`}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {formatViews(video.likes)}
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDislike}
                  className="rounded-r-full"
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="secondary" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="secondary" size="sm">
                <ListPlus className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="ghost" size="icon">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-secondary p-4">
            <p className="text-sm font-medium">
              {formatViews(video.views)} views •{" "}
              {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
            </p>
            <p className="mt-2 text-sm whitespace-pre-wrap">{video.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <span key={tag} className="text-sm text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold">{videoComments.length} Comments</h2>

            {isAuthenticated && profile && (
              <div className="mt-4 flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
                  <AvatarFallback>{profile.username?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment... (max 2000 characters)"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value.slice(0, 2000))}
                    className="min-h-[80px]"
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{commentText.length}/2000</p>
                  <div className="mt-2 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setCommentText("")}>
                      Cancel
                    </Button>
                    <Button onClick={handleComment}>Comment</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {videoComments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.userAvatar} alt={comment.username} />
                    <AvatarFallback>{comment.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.username}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">Related Videos</h2>
          {relatedVideos.map((v) => (
            <VideoCard key={v.id} video={v} layout="list" />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
