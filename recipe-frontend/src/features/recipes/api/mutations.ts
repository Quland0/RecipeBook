import { api } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    Category,
    Recipe,
    StrapiListResponse,
    StrapiResponse,
} from "@/types/recipe";


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
            const res = await api.get<StrapiListResponse<Recipe>>(
                "/recipes?populate[image][fields][0]=url&populate[category][fields][0]=name"
            );
            return res.data.data;
        },
        staleTime: 30_000,
    });
}

export function useRecipe(documentId?: string) {
    return useQuery<Recipe>({
        queryKey: ["recipe", documentId],
        queryFn: async () => {
            const res = await api.get<StrapiResponse<Recipe>>(
                `/recipes/${documentId}?populate[image][fields][0]=url&populate[category][fields][0]=name&populate[author][fields][0]=username`
            );
            return res.data.data;
        },
        enabled: !!documentId,
        retry: false,
    });
}


async function uploadImageRequest(file: File) {
    const formData = new FormData();
    formData.append("files", file);

    const res = await api.post<UploadResponseItem[]>("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data[0];
}

async function createRecipeRequest(payload: RecipePayload) {
    const res = await api.post<RecipeResponse>("/recipes", {
        data: payload,
    });

    return res.data.data;
}

async function updateRecipeRequest(
    documentId: string,
    payload: Partial<RecipePayload>
) {
    const res = await api.put<RecipeResponse>(`/recipes/${documentId}`, {
        data: payload,
    });

    return res.data.data;
}

async function deleteRecipeRequest(documentId: string) {
    await api.delete(`/recipes/${documentId}`);
}


export function useUploadImage() {
    return useMutation({
        mutationFn: uploadImageRequest,
    });
}

export function useCreateRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRecipeRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
    });
}

export function useUpdateRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         documentId,
                         payload,
                     }: {
            documentId: string;
            payload: Partial<RecipePayload>;
        }) => updateRecipeRequest(documentId, payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
            queryClient.invalidateQueries({
                queryKey: ["recipe", variables.documentId],
            });
        },
    });
}

export function useDeleteRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRecipeRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
    });
}