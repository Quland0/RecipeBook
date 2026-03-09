import { api } from "@/api/axios";
import type { StrapiListResponse, StrapiResponse } from "@/types/api.types";
import type {
    RecipePayload,
    RecipeResponse,
    RecipeTypes,
    UploadResponseItem,
} from "@/types/recipe.types";

export async function fetchRecipes() {
    const res = await api.get<StrapiListResponse<RecipeTypes>>(
        "/recipes?populate[image][fields][0]=url&populate[category][fields][0]=name"
    );

    return res.data.data;
}

export async function fetchRecipe(documentId: string) {
    const res = await api.get<StrapiResponse<RecipeTypes>>(
        `/recipes/${documentId}?populate[image][fields][0]=url&populate[category][fields][0]=name&populate[author][fields][0]=username`
    );

    return res.data.data;
}

export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("files", file);

    const res = await api.post<UploadResponseItem[]>("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data[0];
}

export async function createRecipe(payload: RecipePayload) {
    const res = await api.post<RecipeResponse>("/recipes", {
        data: payload,
    });

    return res.data.data;
}

export async function updateRecipe(
    documentId: string,
    payload: Partial<RecipePayload>
) {
    const res = await api.put<RecipeResponse>(`/recipes/${documentId}`, {
        data: payload,
    });

    return res.data.data;
}

export async function deleteRecipe(documentId: string) {
    await api.delete(`/recipes/${documentId}`);
}