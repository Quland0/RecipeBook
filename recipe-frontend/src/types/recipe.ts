export type Recipe = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    cookingTime: number;
    image: { url: string } | null;
    category: { id: number; name: string } | null;
};

export type Category = {
    id: number;
    documentId: string;
    name: string;
    slug: string | null;
};

export type StrapiListResponse<T> = {
    data: T[];
    meta: any;
};