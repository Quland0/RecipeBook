import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "./categories.api";
import type { Category } from "@/types/category.types";

export function useCategories() {
    return useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 30_000,
    });
}