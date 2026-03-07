import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/api/queries";
import { useAuth } from "@/features/auth/useAuth";
import { createRecipe, uploadImage } from "@/features/recipes/api/mutations";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { PageError } from "@/components/page/PageError";

export default function CreateRecipePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const categoriesQuery = useCategories();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    if (categoriesQuery.isLoading) {
        return <div className="p-10">Загрузка категорий...</div>;
    }

    if (categoriesQuery.isError) {
        return <PageError message="Ошибка загрузки категорий" />;
    }

    const categories = categoriesQuery.data ?? [];

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
            setError("Пожалуйста, заполни все обязательные поля");
            return;
        }

        try {
            setIsSubmitting(true);

            let uploadedImageId: number | undefined;

            if (values.image) {
                const uploadedFile = await uploadImage(values.image);
                uploadedImageId = uploadedFile.id;
            }

            const createdRecipe = await createRecipe({
                title: values.title,
                description: values.description,
                cookingTime: Number(values.cookingTime),
                category: Number(values.categoryId),
                image: uploadedImageId,
                author: user?.id,
            });

            navigate(`/recipes/${createdRecipe.documentId}`);
        } catch (err) {
            console.error(err);
            setError("Не удалось создать рецепт");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-10">
            <h1 className="text-3xl font-bold mb-6">Создать рецепт</h1>

            <RecipeForm
                categories={categories}
                isSubmitting={isSubmitting}
                error={error}
                submitLabel="Создать рецепт"
                onSubmit={handleSubmit}
            />
        </div>
    );
}