"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useState } from "react";
import { signUpNewUser, signInWithEmail } from "../../actions/auth-action";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export function AuthDialog() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const { refreshAuth } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isSignUp) {
        const { data, error } = await signUpNewUser(name, email, password);
        if (error) throw error;
        if (!data?.user) {
          alert(
            "Registration successful. Please check your email to confirm your account before signing in.",
          );
          setIsSignUp(false);
          setIsOpen(false);
          return;
        }
      } else {
        const { data, error } = await signInWithEmail(email, password);
        if (error) throw error;
      }

      await refreshAuth();

      setIsOpen(false);
      router.push("/design");
      router.refresh();
    } catch (error) {
      alert(
        `${isSignUp ? "Registration" : "Sign in"} failed. Please check your credentials and try again.`,
      );
      console.log(`${isSignUp ? "SignUp" : "SignIn"} error >>>`, error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white border-white/20 text-black hover:bg-white/20 hover:text-white transition-smooth duration-100 font-semibold px-6"
        >
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border border-white/20 shadow-premium p-0 overflow-hidden rounded-2xl">
        <div className="relative p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-responsive-xl font-bold text-gray-900 tracking-tight">
              {isSignUp ? "Create an account" : "Welcome back"}
            </DialogTitle>
            <DialogDescription className="text-responsive-sm text-gray-600 mt-1.5">
              {isSignUp
                ? "Join SimpleResu to build your professional resume in minutes."
                : "Sign in to access your saved resumes and templates."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isSignUp && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700 tracking-wide"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  type="text"
                  required
                  className="h-11 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-smooth text-sm"
                />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 tracking-wide"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                type="email"
                required
                className="h-11 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-smooth text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700 tracking-wide"
                >
                  Password
                </Label>
                {!isSignUp && (
                  <a
                    href="#"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-smooth"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                required
                className="h-11 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-smooth text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-blue text-white font-bold rounded-lg shadow-glow hover-lift transition-smooth mt-2"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="text-sm text-gray-600">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-bold transition-smooth outline-none focus:underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
