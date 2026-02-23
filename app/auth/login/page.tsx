"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInWithEmail } from "../../../actions/auth-action";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log(email, password);

    try {
      const { data, error } = await signInWithEmail(email, password);
      if (error) throw error;

      await refreshAuth();

      router.push("/");
    } catch (error) {
      alert(`Sign in failed. Please check your credentials and try again.`);
      console.log(`SignIn error >>>`, error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 px-4 py-8 sm:px-6 sm:py-12 ">
      <div className="relative z-10 flex flex-col items-center w-full max-w-md ">
        <Link
          href="/"
          className="text-responsive-2xl font-bold text-white tracking-tight mb-6 sm:mb-8 hover:text-gray-100 transition-smooth"
        >
          SimpleResu
        </Link>

        <Card className="w-full bg-white/90 backdrop-blur-xl shadow-premium border border-white/30 rounded-2xl">
          <CardHeader className="flex flex-col gap-1 px-5 pt-6 pb-2 sm:px-8 sm:pt-8">
            <CardTitle className="text-responsive-xl font-bold text-gray-900">
              Login to your account
            </CardTitle>
            <CardDescription className="text-responsive-sm text-gray-600">
              Enter your credentials to access your resumes
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="px-5 sm:px-8">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 tracking-wide"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
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
                    <a
                      href="#"
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-smooth font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    className="h-11 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-smooth text-sm"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-5 pb-6 pt-8 sm:px-8 sm:pb-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-blue text-white font-semibold rounded-lg shadow-glow hover-lift transition-smooth text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="flex items-center w-full">
                <p className="text-sm text-gray-600 pr-1">
                  Don't have an account?
                </p>
                <Link href="/auth/register">
                  <Button
                    variant="link"
                    className="p-0 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center mt-5 sm:mt-6 text-white/70 text-xs sm:text-sm animate-fade-in delay-300 leading-relaxed">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="underline text-white/90 hover:text-white transition-smooth"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline text-white/90 hover:text-white transition-smooth"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
