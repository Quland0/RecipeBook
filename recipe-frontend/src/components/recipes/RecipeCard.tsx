import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RecipeTypes } from "@/types/recipe.types.ts";

const API_URL = import.meta.env.BASE_API_URL ?? "http://localhost:1337";

type RecipeCardProps = {
  recipe: RecipeTypes;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {recipe.image && (
        <img
          src={`${API_URL}${recipe.image.url}`}
          alt={recipe.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}

      <CardHeader>
        <CardTitle className="overflow-hidden leading-tight max-h-[3rem]">
          {recipe.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{recipe.category?.name ?? ""}</Badge>
          <p className="text-muted-foreground whitespace-nowrap">
            {recipe.cookingTime} мин
          </p>
        </div>

        {recipe.author?.username && (
          <p className="text-sm text-muted-foreground mt-2">
            {" "}
            {recipe.author.username}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/recipes/${recipe.documentId}`}>Открыть рецепт</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
