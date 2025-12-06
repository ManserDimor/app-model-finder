import { Layout } from "@/components/layout/Layout";
import { VideoGrid } from "@/components/video/VideoGrid";
import { useStore } from "@/store/useStore";

const Search = () => {
  const { videos, searchQuery } = useStore();

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <h1 className="mb-4 text-xl font-bold">
          {searchQuery ? `Search results for "${searchQuery}"` : "Search"}
        </h1>
        {filteredVideos.length > 0 ? (
          <VideoGrid videos={filteredVideos} layout="list" />
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {searchQuery ? "No videos found" : "Enter a search term to find videos"}
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Search;
