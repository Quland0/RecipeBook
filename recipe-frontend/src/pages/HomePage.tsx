import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { PageLoader } from "@/components/page/PageLoader";
import { PageError } from "@/components/page/PageError";
import { RecipeCard } from "@/components/recipes/RecipeCard";

import { useCategories, useRecipes } from "@/features/recipes/api/mutations";
import type { Category, Recipe } from "@/types/recipe";

const HomePage = () => {
  const [search, setSearch] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const categoriesQuery = useCategories();
  const recipesQuery = useRecipes();

  const isLoading = categoriesQuery.isLoading || recipesQuery.isLoading;
  const isError = categoriesQuery.isError || recipesQuery.isError;

  if (isLoading) return <PageLoader />;
  if (isError) return <PageError />;

  const recipes: Recipe[] = recipesQuery.data ?? [];
  const categories: Category[] = categoriesQuery.data ?? [];

  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((recipe) =>
      categoryId ? recipe.category?.id === categoryId : true,
    );

  return (
    <div className="p-10">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
