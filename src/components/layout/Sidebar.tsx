import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  ListVideo,
  Flame,
  Music,
  Gamepad2,
  Newspaper,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const mainNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: PlaySquare, label: "Subscriptions", href: "/subscriptions" },
];

const libraryItems = [
  { icon: Clock, label: "History", href: "/history" },
  { icon: ThumbsUp, label: "Liked Videos", href: "/liked" },
  { icon: ListVideo, label: "Playlists", href: "/playlists" },
];

const exploreItems = [
  { icon: Flame, label: "Trending", href: "/explore?category=trending" },
  { icon: Music, label: "Music", href: "/explore?category=Music" },
  { icon: Gamepad2, label: "Gaming", href: "/explore?category=Gaming" },
  { icon: Newspaper, label: "News", href: "/explore?category=News" },
  { icon: Trophy, label: "Sports", href: "/explore?category=Sports" },
];

export const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, subscriptions, channels } = useStore();
  const { isAuthenticated } = useAuth();

  const subscribedChannels = channels.filter((c) =>
    subscriptions.includes(c.id)
  );

  if (!sidebarOpen) {
    return (
      <aside className="hidden w-[72px] flex-shrink-0 border-r border-border md:block">
        <div className="flex flex-col items-center gap-1 py-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs hover:bg-accent",
                location.pathname === item.href && "bg-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden w-60 flex-shrink-0 border-r border-border md:block">
      <ScrollArea className="h-[calc(100vh-56px)]">
        <div className="flex flex-col gap-1 p-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-4 rounded-lg px-3 py-2 hover:bg-accent",
                location.pathname === item.href && "bg-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}

          <Separator className="my-2" />

          {isAuthenticated && (
            <>
              <p className="px-3 py-2 text-sm font-medium">Library</p>
              {libraryItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-3 py-2 hover:bg-accent",
                    location.pathname === item.href && "bg-accent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}

              <Separator className="my-2" />
            </>
          )}

          <p className="px-3 py-2 text-sm font-medium">Explore</p>
          {exploreItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-4 rounded-lg px-3 py-2 hover:bg-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}

          {subscribedChannels.length > 0 && (
            <>
              <Separator className="my-2" />
              <p className="px-3 py-2 text-sm font-medium">Subscriptions</p>
              {subscribedChannels.map((channel) => (
                <Link
                  key={channel.id}
                  to={`/channel/${channel.id}`}
                  className="flex items-center gap-4 rounded-lg px-3 py-2 hover:bg-accent"
                >
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm truncate">{channel.name}</span>
                </Link>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};
