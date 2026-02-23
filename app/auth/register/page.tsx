"use client";

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
import { signUpNewUser } from "../../../actions/auth-action";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data, error } = await signUpNewUser(name, email, password);
      if (error) throw error;

      await refreshAuth();

      router.push("/");
    } catch (error) {
      alert(`Sign Up failed. Please check your credentials and try again.`);
      console.log(`SignIn error >>>`, error);
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
              Create your account
            </CardTitle>
            <CardDescription className="text-responsive-sm text-gray-600">
              Enter your credentials to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="px-5 sm:px-8">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-semibold text-gray-700 tracking-wide"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="fullName"
                    placeholder="John Doe"
                    name="fullName"
                    required
                    className="h-11 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-smooth text-sm"
                  />
                </div>
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
                className="w-full h-11 bg-gradient-blue text-white font-semibold rounded-lg shadow-glow hover-lift transition-smooth text-sm"
              >
                Register
              </Button>

              <div className="flex items-center w-full">
                <p className="text-sm text-gray-600 pr-1">
                  Already have an account?
                </p>
                <Link href="/auth/login">
                  <Button
                    variant="link"
                    className="p-0 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    Sign In
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
