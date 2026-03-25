import { Laptop } from "../../../drizzle/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LaptopCardProps {
  laptop: Laptop;
}

export function LaptopCard({ laptop }: LaptopCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{laptop.name}</CardTitle>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">{laptop.condition}</Badge>
          <Badge variant="outline" className="text-xs">{laptop.warranty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Processor</p>
              <p className="font-medium truncate">{laptop.processor}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Graphics</p>
              <p className="font-medium truncate">{laptop.graphicsCard}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">RAM</p>
              <p className="font-medium">{laptop.ram}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Storage</p>
              <p className="font-medium">{laptop.storage}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Display</p>
              <p className="font-medium">{laptop.display}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">OS</p>
              <p className="font-medium truncate">{laptop.operatingSystem}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-2xl font-bold text-primary">{laptop.price} zł</p>
        </div>
      </CardContent>
    </Card>
  );
}
