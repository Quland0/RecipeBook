import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RecipePage from "../pages/RecipePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/recipes/:documentId",
        element: <RecipePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
]);