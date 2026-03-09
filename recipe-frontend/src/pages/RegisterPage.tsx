import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await register(username, email, password);
      navigate("/");
    } catch {
      setError("Не удалось зарегистрироваться");
    }
  };

  return (
    <div className="max-w-md mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Регистрация</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">
          Зарегистрироваться
        </Button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
