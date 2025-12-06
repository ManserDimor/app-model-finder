import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { categories } from "@/data/mockData";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export const CategoryBar = () => {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant="secondary"
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "rounded-lg",
              selectedCategory === category &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
