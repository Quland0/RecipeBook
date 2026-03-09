import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/types/recipe";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type RecipeFormValues = {
    title: string;
    description: string;
    cookingTime: string;
    categoryId: string;
    image: File | null;
};

type RecipeFormProps = {
    categories: Category[];
    isSubmitting?: boolean;
    initialValues?: Partial<RecipeFormValues>;
    initialImageUrl?: string | null;
    submitLabel?: string;
    error?: string;
    onSubmit: (values: RecipeFormValues) => Promise<void>;
};

export function RecipeForm({
                               categories,
                               isSubmitting = false,
                               initialValues,
                               initialImageUrl = null,
                               submitLabel = "Сохранить",
                               error,
                               onSubmit,
                           }: RecipeFormProps) {
    const [form, setForm] = useState<RecipeFormValues>({
        title: initialValues?.title ?? "",
        description: initialValues?.description ?? "",
        cookingTime: initialValues?.cookingTime ?? "",
        categoryId: initialValues?.categoryId ?? "",
        image: initialValues?.image ?? null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        initialImageUrl
    );

    const handleChange = (
        field: keyof RecipeFormValues,
        value: string | File | null
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageChange = (file: File | null) => {
        handleChange("image", file);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImagePreview(initialImageUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                placeholder="Название рецепта"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
            />

            <Textarea
                placeholder="Описание рецепта"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="min-h-40"
            />

            <Input
                type="number"
                placeholder="Время приготовления (мин)"
                value={form.cookingTime}
                onChange={(e) => handleChange("cookingTime", e.target.value)}
            />

            <Select
                value={form.categoryId}
                onValueChange={(value) => handleChange("categoryId", value)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выбери категорию" />
                </SelectTrigger>

                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />

            {imagePreview && (
                <div className="mt-2">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-60 object-cover rounded-lg border"
                    />
                </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Сохранение..." : submitLabel}
            </Button>
        </form>
    );
}