import { useParams, Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    useDeleteRecipe,
    useRecipe,
} from "@/features/recipes/api/mutations";
import { useAuth } from "@/features/auth/useAuth";

const API_URL =
    import.meta.env.BASE_API_URL?.replace("/api", "") ??
    "http://localhost:1337";

export default function RecipePage() {
    const { documentId } = useParams<{ documentId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data, isLoading, isError } = useRecipe(documentId);
    const deleteRecipeMutation = useDeleteRecipe();

    const isOwner = !!user && !!data?.author && user.id === data.author.id;

    const handleDelete = async () => {
        const confirmed = window.confirm("Удалить рецепт?");
        if (!confirmed || !documentId) return;

        try {
            await deleteRecipeMutation.mutateAsync(documentId);
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Не удалось удалить рецепт");
        }
    };

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
            <div className="flex items-center gap-3 flex-wrap">
                <Button asChild variant="outline" size="sm">
                    <Link to="/">Назад</Link>
                </Button>

                {isOwner && (
                    <>
                        <Button asChild variant="outline" size="sm">
                            <Link to={`/recipes/${data.documentId}/edit`}>
                                Редактировать
                            </Link>
                        </Button>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleteRecipeMutation.isPending}
                        >
                            {deleteRecipeMutation.isPending ? "Удаление..." : "Удалить"}
                        </Button>
                    </>
                )}
            </div>

            {data.image && (
                <img
                    src={`${API_URL}${data.image.url}`}
                    alt={data.title}
                    className="w-full h-72 object-cover rounded-xl shadow-md"
                    loading="lazy"
                />
            )}

            <h1 className="text-3xl font-bold">{data.title}</h1>

            <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="secondary">
                    {data.category?.name ?? "Без категории"}
                </Badge>

                <span className="text-muted-foreground">
                    {data.cookingTime} мин
                </span>

                {data.author?.username && (
                <span className="text-muted-foreground">
                {data.author.username}
                </span>
                )}
            </div>

            <div className="whitespace-pre-line leading-relaxed text-lg">
                {data.description}
            </div>
        </div>
    );
}