import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          RecipeBook
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Главная
          </Link>

          <Link
            to="/create-recipe"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Создать рецепт
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                Привет, {user?.username}
              </span>

              <Button variant="outline" size="sm" onClick={logout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Войти</Link>
              </Button>

              <Button asChild size="sm">
                <Link to="/register">Регистрация</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
