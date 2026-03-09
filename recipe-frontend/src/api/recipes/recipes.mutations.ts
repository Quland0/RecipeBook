import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createRecipe,
    deleteRecipe,
    updateRecipe,
    uploadImage,
} from "./recipes.api";
import type { RecipePayload } from "@/types/recipe.types";

export function useUploadImage() {
    return useMutation({
        mutationFn: uploadImage,
    });
}

export function useCreateRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRecipe,
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
        }) => updateRecipe(documentId, payload),
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
        mutationFn: deleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
    });
}