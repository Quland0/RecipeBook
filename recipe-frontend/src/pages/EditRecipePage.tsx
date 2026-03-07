import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useCategories } from "@/api/queries";
import { uploadImage, updateRecipe } from "@/features/recipes/api/mutations";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { PageError } from "@/components/page/PageError";
import type { Recipe, StrapiResponse } from "@/types/recipe";

const STRAPI_URL =
    import.meta.env.BASE_API_URL?.replace("/api", "") ??
    "http://localhost:1337";

export default function EditRecipePage() {
    const { documentId } = useParams<{ documentId: string }>();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const categoriesQuery = useCategories();

    const recipeQuery = useQuery<Recipe>({
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

    if (categoriesQuery.isLoading || recipeQuery.isLoading) {
        return <div className="p-10">Загрузка...</div>;
    }

    if (categoriesQuery.isError || recipeQuery.isError || !recipeQuery.data) {
        return <PageError message="Ошибка загрузки рецепта" />;
    }

    const categories = categoriesQuery.data ?? [];
    const recipe = recipeQuery.data;

    const handleSubmit = async (values: {
        title: string;
        description: string;
        cookingTime: string;
        categoryId: string;
        image: File | null;
    }) => {
        setError("");

        if (
            !values.title ||
            !values.description ||
            !values.cookingTime ||
            !values.categoryId
        ) {
            setError("Заполните все обязательные поля");
            return;
        }

        try {
            setIsSubmitting(true);

            let uploadedImageId: number | undefined;

            if (values.image) {
                const uploadedFile = await uploadImage(values.image);
                uploadedImageId = uploadedFile.id;
            }

            const updatedRecipe = await updateRecipe(documentId!, {
                title: values.title,
                description: values.description,
                cookingTime: Number(values.cookingTime),
                category: Number(values.categoryId),
                ...(uploadedImageId ? { image: uploadedImageId } : {}),
            });

            navigate(`/recipes/${updatedRecipe.documentId}`);
        } catch (err) {
            console.error(err);
            setError("Не удалось обновить рецепт");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-10">
            <h1 className="text-3xl font-bold mb-6">Редактировать рецепт</h1>

            <RecipeForm
                categories={categories}
                isSubmitting={isSubmitting}
                error={error}
                submitLabel="Сохранить изменения"
                initialValues={{
                    title: recipe.title,
                    description: recipe.description,
                    cookingTime: String(recipe.cookingTime),
                    categoryId: recipe.category ? String(recipe.category.id) : "",
                }}
                initialImageUrl={recipe.image ? `${STRAPI_URL}${recipe.image.url}` : null}
                onSubmit={handleSubmit}
            />
        </div>
    );
}