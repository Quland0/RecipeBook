import { api } from "@/api/axios";

type UploadResponseItem = {
    id: number;
    url: string;
};

type RecipePayload = {
    title: string;
    description: string;
    cookingTime: number;
    category: number;
    image?: number;
    author?: number;
};

type RecipeResponse = {
    data: {
        id: number;
        documentId: string;
        title: string;
    };
};

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