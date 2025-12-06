import { Layout } from "@/components/layout/Layout";
import { CategoryBar } from "@/components/video/CategoryBar";
import { VideoGrid } from "@/components/video/VideoGrid";
import { useStore } from "@/store/useStore";

const Index = () => {
  const { videos, selectedCategory } = useStore();

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <CategoryBar />
        <VideoGrid videos={filteredVideos} />
      </div>
    </Layout>
  );
};

export default Index;
