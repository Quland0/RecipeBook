import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/hooks/useAuth.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await login(identifier, password);
      navigate("/");
    } catch {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="max-w-md mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Вход</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Email или username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">
          Войти
        </Button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link to="/register" className="underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
