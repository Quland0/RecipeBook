import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

const HomePage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["recipes"],
        queryFn: async () => {
            const res = await api.get("/recipes?populate=*");
            return res.data;
        },
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Рецепты</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default HomePage;