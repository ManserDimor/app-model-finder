import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { useStore } from "@/store/useStore";

const Liked = () => {
  const { videos, likedVideos } = useStore();

  const likedVideosList = likedVideos
    .map((id) => videos.find((v) => v.id === id))
    .filter(Boolean) as typeof videos;

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="mb-4 text-xl font-bold">Liked Videos</h1>
        {likedVideosList.length > 0 ? (
          <VideoGrid videos={likedVideosList} layout="list" />
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No liked videos yet
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Liked;
