import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
