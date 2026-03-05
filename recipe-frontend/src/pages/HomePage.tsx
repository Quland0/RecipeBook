import { useState } from "react";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { PageLoader } from "@/components/page/PageLoader";
import { PageError } from "@/components/page/PageError";

import { useCategories, useRecipes } from "@/api/queries";
import type { Category, Recipe } from "@/types/recipe";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:1337";

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
            recipe.title.toLowerCase().includes(search.toLowerCase())
        )
        .filter((recipe) =>
            categoryId ? recipe.category?.id === categoryId : true
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
                        <Card key={recipe.id} className="overflow-hidden">
                            {recipe.image && (
                                <img
                                    src={`${API_URL}${recipe.image.url}`}
                                    alt={recipe.title}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                />
                            )}

                            <CardHeader>
                                <CardTitle>{recipe.title}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary">
                                        {recipe.category?.name ?? ""}
                                    </Badge>

                                    <p className="text-muted-foreground">{recipe.cookingTime} мин</p>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button asChild>
                                    <Link to={`/recipes/${recipe.documentId}`}>Открыть рецепт</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;