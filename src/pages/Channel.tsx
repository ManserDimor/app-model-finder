import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const formatCount = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

const Channel = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { channels, videos, subscriptions, subscribe, unsubscribe } = useStore();

  const channel = channels.find((c) => c.id === id);
  const channelVideos = videos.filter((v) => v.channelId === id);
  const isSubscribed = channel && subscriptions.includes(channel.id);

  if (!channel) {
    return (
      <Layout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Channel not found</p>
        </div>
      </Layout>
    );
  }

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast({ title: "Please sign in to subscribe" });
      return;
    }
    if (isSubscribed) {
      unsubscribe(channel.id);
      toast({ title: `Unsubscribed from ${channel.name}` });
    } else {
      subscribe(channel.id);
      toast({ title: `Subscribed to ${channel.name}` });
    }
  };

  return (
    <Layout>
      <div>
        {/* Banner */}
        <div className="h-32 md:h-48 lg:h-56">
          <img
            src={channel.banner}
            alt={`${channel.name} banner`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Channel info */}
        <div className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={channel.avatar} alt={channel.name} />
                  <AvatarFallback>{channel.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{channel.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {formatCount(channel.subscribers)} subscribers • {channel.videoCount} videos
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {channel.description}
                  </p>
                </div>
              </div>
              <Button
                variant={isSubscribed ? "secondary" : "default"}
                onClick={handleSubscribe}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Tabs defaultValue="videos">
            <TabsList>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="videos" className="mt-4">
              {channelVideos.length > 0 ? (
                <VideoGrid videos={channelVideos} />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No videos yet
                </p>
              )}
            </TabsContent>
            <TabsContent value="about" className="mt-4">
              <div className="max-w-2xl">
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <p className="text-muted-foreground">{channel.description}</p>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Joined {new Date(channel.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Channel;
