import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

type Recipe = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    cookingTime: number;
    image: { url: string } | null;
    category: { id: number; name: string } | null;
};

type Category = {
    id: number;
    documentId: string;
    name: string;
    slug: string | null;
};

type StrapiListResponse<T> = {
    data: T[];
    meta: any;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:1337";

const HomePage = () => {
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const categoriesQuery = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get<StrapiListResponse<Category>>("/categories");
            return res.data.data;
        },
        staleTime: 30000,
    });

    const recipesQuery = useQuery<Recipe[]>({
        queryKey: ["recipes"],
        queryFn: async () => {
            const res = await api.get<StrapiListResponse<Recipe>>(
                "/recipes?populate=*"
            );
            return res.data.data;
        },
        staleTime: 30000,
    });

    const isLoading = categoriesQuery.isLoading || recipesQuery.isLoading;

    if (isLoading) {
        return (
            <div className="p-10 grid grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (recipesQuery.isError || categoriesQuery.isError) {
        return (
            <div className="p-10">
                <p className="text-red-500">Ошибка загрузки данных</p>
            </div>
        );
    }

    const recipes = recipesQuery.data ?? [];
    const categories = categoriesQuery.data ?? [];

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
                <p className="text-muted-foreground">Ничего не найдено 😕</p>
            ) : (
                <div className="grid grid-cols-3 gap-6">
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

                                    <p className="text-muted-foreground">
                                        ⏱ {recipe.cookingTime} мин
                                    </p>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button asChild>
                                    <Link to={`/recipes/${recipe.id}`}>Открыть рецепт</Link>
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