"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sun, Moon, User } from "lucide-react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter(); // Initialize useRouter

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed:", await response.json());
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface text-text-primary shadow-sm">
      <div className="flex h-16 items-center justify-between w-full px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">ATS Resume Builder</span>
        </Link>
        <div className="flex  items-center  space-x-4">
          <nav className="flex items-center ">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-text-primary hover:bg-black/10"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-primary hover:bg-black/10"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">User Profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-surface border-border"
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
