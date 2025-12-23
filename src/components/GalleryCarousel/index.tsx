import { Gallery } from "../../type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageOff } from "lucide-react";

function GalleryCarousel({ pictures }: Gallery) {
  const uniqueUrls = [...new Set(pictures.map((p) => p.url))];
  const hasMultipleImages = uniqueUrls.length > 1;

  if (!pictures.length) {
    return (
      <div className="flex items-center justify-center aspect-square bg-muted rounded-lg">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageOff className="h-12 w-12" />
          <span className="text-sm">Sem imagem</span>
        </div>
      </div>
    );
  }

  return (
    <Carousel
      className="w-full relative group"
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {pictures.map((picture, index) => (
          <CarouselItem key={picture.id || index}>
            <div className="flex items-center justify-center aspect-square bg-card rounded-lg overflow-hidden border">
              <img
                src={picture.url}
                alt={`Imagem ${index + 1}`}
                className="max-h-full max-w-full object-contain p-4"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {hasMultipleImages && (
        <>
          <CarouselPrevious 
            className="left-2 h-10 w-10 opacity-70 hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
          />
          <CarouselNext 
            className="right-2 h-10 w-10 opacity-70 hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
          />
        </>
      )}
    </Carousel>
  );
}

export default GalleryCarousel;
