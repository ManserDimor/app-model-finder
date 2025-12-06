import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CategoryBar } from "@/components/video/CategoryBar";
import { VideoGrid } from "@/components/video/VideoGrid";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { videos, selectedCategory, setSelectedCategory } = useStore();

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam, setSelectedCategory]);

  const filteredVideos =
    selectedCategory === "All" || selectedCategory === "trending"
      ? [...videos].sort((a, b) => b.views - a.views)
      : videos.filter((v) => v.category === selectedCategory);

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="mb-4 text-xl font-bold">
          {selectedCategory === "trending" ? "Trending" : `Explore ${selectedCategory !== "All" ? selectedCategory : ""}`}
        </h1>
        <CategoryBar />
        <VideoGrid videos={filteredVideos} />
      </div>
    </Layout>
  );
};

export default Explore;
