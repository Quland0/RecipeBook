export interface Recipe {
    id: number;
    documentId: string;
    title: string;
    description: string;
    cookingTime: number;
    image: {
        url: string;
    } | null;
}