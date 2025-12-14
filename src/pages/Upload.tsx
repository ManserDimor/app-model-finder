import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, Film } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/mockData";
import { v4 as uuidv4 } from "uuid";
import { videoUploadSchema, getFirstError } from "@/lib/validation";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isAuthenticated, addVideo } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string; category?: string; tags?: string }>({});

  if (!isAuthenticated || !currentUser) {
    return (
      <Layout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Please sign in to upload videos</p>
        </div>
      </Layout>
    );
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = videoUploadSchema.safeParse({ title, description, category, tags });
    if (!result.success) {
      const fieldErrors: { title?: string; description?: string; category?: string; tags?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as "title" | "description" | "category" | "tags";
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({ title: getFirstError(result.error), variant: "destructive" });
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newVideo = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      thumbnailUrl: thumbnailFile 
        ? URL.createObjectURL(thumbnailFile) 
        : "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400",
      videoUrl: videoFile 
        ? URL.createObjectURL(videoFile)
        : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 600,
      views: 0,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
      channelId: `channel-${currentUser.id}`,
      channelName: currentUser.username,
      channelAvatar: currentUser.avatar,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 20),
      category,
    };

    addVideo(newVideo);
    setIsUploading(false);
    toast({ title: "Video uploaded successfully!" });
    navigate(`/watch/${newVideo.id}`);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-5 w-5" />
              Upload Video
            </CardTitle>
            <CardDescription>
              Share your video with the world. Files are stored locally in this demo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="video">Video File</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="video"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Film className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {videoFile ? videoFile.name : "Click to upload video"}
                      </p>
                    </div>
                    <input
                      id="video"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoChange}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail (optional)</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title * (3-100 characters)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  maxLength={100}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
                <p className="text-xs text-muted-foreground">{title.length}/100</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description * (10-5000 characters)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={4}
                  maxLength={5000}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
                <p className="text-xs text-muted-foreground">{description.length}/5000</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated, max 20 tags)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tutorial, programming, web"
                  maxLength={500}
                  className={errors.tags ? "border-destructive" : ""}
                />
                {errors.tags && (
                  <p className="text-sm text-destructive">{errors.tags}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Video"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Upload;
