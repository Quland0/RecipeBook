export type RecipeTypes = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cookingTime: number;
  image: { url: string } | null;
  category: { id: number; name: string } | null;
  author: { id: number; username: string } | null;
};

export type Category = {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
};

export type RecipeImage = {
  id?: number;
  url: string;
};
export type UploadResponseItem = {
  id: number;
  url: string;
};

export type RecipePayload = {
  title: string;
  description: string;
  cookingTime: number;
  category: number;
  image?: number;
  author?: number;
};

export type RecipeResponse = {
  data: {
    id: number;
    documentId: string;
    title: string;
  };
};