import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { Category, Recipe, StrapiListResponse } from "../types/recipe.ts";

export function useCategories() {
    return useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get<StrapiListResponse<Category>>("/categories");
            return res.data.data;
        },
        staleTime: 30_000,
    });
}

export function useRecipes() {
    return useQuery<Recipe[]>({
        queryKey: ["recipes"],
        queryFn: async () => {
            const res = await api.get<StrapiListResponse<Recipe>>("/recipes?populate[image][fields][0]=url&populate[category][fields][0]=name&populate[author][fields][0]=username");
            return res.data.data;
        },
        staleTime: 30_000,
    });
}