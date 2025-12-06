import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { useStore } from "@/store/useStore";

const Subscriptions = () => {
  const { videos, subscriptions } = useStore();

  const subscriptionVideos = videos.filter((v) =>
    subscriptions.includes(v.channelId)
  );

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="mb-4 text-xl font-bold">Subscriptions</h1>
        {subscriptionVideos.length > 0 ? (
          <VideoGrid videos={subscriptionVideos} />
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Subscribe to channels to see their videos here
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Subscriptions;
