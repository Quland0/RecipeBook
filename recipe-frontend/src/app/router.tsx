import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RecipePage from "../pages/RecipePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CreateRecipePage from "../pages/CreateRecipePage";
import EditRecipePage from "../pages/EditRecipePage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
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
      {
        path: "/create-recipe",
        element: (
          <ProtectedRoute>
            <CreateRecipePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/recipes/:documentId/edit",
        element: (
          <ProtectedRoute>
            <EditRecipePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
