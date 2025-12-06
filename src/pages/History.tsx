import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { useStore } from "@/store/useStore";

const History = () => {
  const { videos, watchHistory } = useStore();

  const historyVideos = watchHistory
    .map((id) => videos.find((v) => v.id === id))
    .filter(Boolean) as typeof videos;

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="mb-4 text-xl font-bold">Watch History</h1>
        {historyVideos.length > 0 ? (
          <VideoGrid videos={historyVideos} layout="list" />
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No watch history yet
          </p>
        )}
      </div>
    </Layout>
  );
};

export default History;
