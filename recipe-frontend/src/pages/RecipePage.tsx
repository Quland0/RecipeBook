import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Recipe = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    cookingTime: number;
    image: { url: string } | null;
    category: { id: number; name: string } | null;
};

type StrapiResponse<T> = {
    data: T;
    meta?: any;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:1337";

export default function RecipePage() {
    const { documentId } = useParams<{ documentId: string }>();

    const { data, isLoading, isError } = useQuery<Recipe>({
        queryKey: ["recipe", documentId],
        queryFn: async () => {
            const res = await api.get<StrapiResponse<Recipe>>(
                `/recipes/${documentId}?populate=*`
            );
            return res.data.data;
        },
        enabled: !!documentId,
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="p-10 max-w-3xl mx-auto space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-9 w-2/3" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="p-10 max-w-3xl mx-auto space-y-4">
                <p className="text-red-500">Ошибка загрузки рецепта</p>
                <Button asChild variant="outline">
                    <Link to="/">Вернуться на главную</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-10 max-w-3xl mx-auto space-y-6">
            <Button asChild variant="outline" size="sm">
                <Link to="/">Назад</Link>
            </Button>

            {data.image && (
                <img
                    src={`${API_URL}${data.image.url}`}
                    alt={data.title}
                    className="w-full h-72 object-cover rounded-xl shadow-md"
                    loading="lazy"
                />
            )}

            <h1 className="text-3xl font-bold">{data.title}</h1>

            <div className="flex items-center gap-4">
                <Badge variant="secondary">
                    {data.category?.name ?? "Без категории"}
                </Badge>
                <span className="text-muted-foreground"> {data.cookingTime} мин</span>
            </div>

            <div className="whitespace-pre-line leading-relaxed text-lg space-y-4">
                {data.description}
            </div>
        </div>
    );
}