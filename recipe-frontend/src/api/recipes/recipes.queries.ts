import { useQuery } from "@tanstack/react-query";
import { fetchRecipe, fetchRecipes } from "./recipes.api";
import type { RecipeTypes } from "@/types/recipe.types";

export function useRecipes() {
    return useQuery<RecipeTypes[]>({
        queryKey: ["recipes"],
        queryFn: fetchRecipes,
        staleTime: 30_000,
    });
}

export function useRecipe(documentId?: string) {
    return useQuery<RecipeTypes>({
        queryKey: ["recipe", documentId],
        queryFn: () => fetchRecipe(documentId!),
        enabled: !!documentId,
        retry: false,
    });
}