import { Link } from "react-router-dom";
import { Video } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VideoCardProps {
  video: Video;
  layout?: "grid" | "list";
}

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatViews = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
};

export const VideoCard = ({ video, layout = "grid" }: VideoCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(video.createdAt), {
    addSuffix: true,
  });

  if (layout === "list") {
    return (
      <Link to={`/watch/${video.id}`} className="flex gap-4 group">
        <div className="relative aspect-video w-64 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="absolute bottom-2 right-2 rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium">
            {formatDuration(video.duration)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="line-clamp-2 text-lg font-medium group-hover:text-primary">
            {video.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatViews(video.views)} • {timeAgo}
          </p>
          <Link
            to={`/channel/${video.channelId}`}
            className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={video.channelAvatar} alt={video.channelName} />
              <AvatarFallback>{video.channelName[0]}</AvatarFallback>
            </Avatar>
            {video.channelName}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {video.description}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/watch/${video.id}`} className="group">
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium">
          {formatDuration(video.duration)}
        </span>
      </div>
      <div className="mt-3 flex gap-3">
        <Link
          to={`/channel/${video.channelId}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={video.channelAvatar} alt={video.channelName} />
            <AvatarFallback>{video.channelName[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <h3 className="line-clamp-2 font-medium group-hover:text-primary">
            {video.title}
          </h3>
          <Link
            to={`/channel/${video.channelId}`}
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {video.channelName}
          </Link>
          <p className="text-sm text-muted-foreground">
            {formatViews(video.views)} • {timeAgo}
          </p>
        </div>
      </div>
    </Link>
  );
};
