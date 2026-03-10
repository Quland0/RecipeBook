import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { PageLoader } from "@/components/page/PageLoader";
import { PageError } from "@/components/page/PageError";
import { RecipeCard } from "@/components/recipes/RecipeCard";

import { useCategories } from "@/api/categories/categories.queries";
import { useRecipes } from "@/api/recipes/recipes.queries";
import type { Category, RecipeTypes } from "@/types/recipe.types.ts";

const HomePage = () => {
  const [search, setSearch] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const categoriesQuery = useCategories();
  const recipesQuery = useRecipes();

  const isLoading = categoriesQuery.isLoading || recipesQuery.isLoading;
  const isError = categoriesQuery.isError || recipesQuery.isError;

  if (isLoading) return <PageLoader />;
  if (isError) return <PageError />;

  const recipes: RecipeTypes[] = recipesQuery.data ?? [];
  const categories: Category[] = categoriesQuery.data ?? [];

  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((recipe) =>
      categoryId ? recipe.category?.id === categoryId : true,
    );

  return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Рецепты</h1>

        <div className="flex flex-col gap-4 mb-8">
          <Input
              placeholder="Поиск рецепта..."
              className="max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2 items-center">
            <Button
                size="sm"
                variant={categoryId === null ? "default" : "outline"}
                onClick={() => setCategoryId(null)}
            >
              Все
            </Button>

            {categories.map((c) => (
                <Button
                    key={c.id}
                    size="sm"
                    variant={categoryId === c.id ? "default" : "outline"}
                    onClick={() => setCategoryId(c.id)}
                >
                  {c.name}
                </Button>
            ))}

            {categoryId !== null && (
                <Badge variant="secondary" className="ml-2">
                  Фильтр: {categories.find((c) => c.id === categoryId)?.name}
                </Badge>
            )}
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
            <p className="text-muted-foreground">Ничего не найдено</p>
        ) : (
            <div className="grid grid-cols-4 gap-6">
              {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe}/>
              ))}
            </div>
        )}
      </div>
  );
};

export default HomePage;
