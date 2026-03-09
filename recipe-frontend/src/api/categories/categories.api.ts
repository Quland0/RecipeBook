import { api } from "@/api/axios";
import type { StrapiListResponse } from "@/types/api.types";
import type { Category } from "@/types/category.types";

export async function fetchCategories() {
    const res = await api.get<StrapiListResponse<Category>>("/categories");
    return res.data.data;
}