import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function AppLayout() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <Header />
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
}