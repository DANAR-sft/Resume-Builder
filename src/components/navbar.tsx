"use client";

import Link from "next/link";
import { AuthDialog } from "./authDialog";
import { useAuth } from "@/contexts/authContext";
import { signOutUser } from "../../actions/auth-action";
import { ProfileDropdown } from "./ProfileDropdown";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const { isLogin, isUser, setIsLogin } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      const response = await signOutUser();
      if (response.ok) {
        setIsLogin(false);
        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      console.log("Logout error >>>", error);
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 w-full bg-gradient-blue shadow-lg z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-center h-16 md:h-20">
          <div className="flex-shrink-0 animate-fade-in">
            <Link
              href="/"
              className="text-white text-xl md:text-2xl font-bold tracking-tight hover:text-gray-100 transition-smooth"
            >
              SimpleResu
            </Link>
          </div>

          <div className="hidden md:flex items-center ml-97 w-full space-x-8">
            <Link
              href="/design"
              className="text-white hover:text-gray-100 transition-smooth font-medium relative group"
            >
              Design
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-gray-100 transition-smooth font-medium relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/help"
              className="text-white hover:text-gray-100 transition-smooth font-medium relative group"
            >
              Help
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            {isLogin ? (
              <ProfileDropdown isUser={isUser} handleLogout={handleLogout} />
            ) : (
              <AuthDialog />
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            {isLogin ? (
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarFallback className="bg-white/10 text-white text-xs font-bold">
                  {isUser.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : null}

            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 rounded-md hover:bg-white/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white/10 backdrop-blur-lg border-t border-white/20">
          <Link
            href="/design"
            className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-smooth font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Design
          </Link>
          <Link
            href="/about"
            className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-smooth font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/help"
            className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-smooth font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Help
          </Link>

          {/* Auth/Profile Section for Mobile */}
          {isLogin ? (
            <div className="pt-2 border-t border-white/20 space-y-2">
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                  Account
                </p>
                <p className="text-sm font-bold text-white">{isUser}</p>
              </div>
              <Link
                href="/my-resume"
                className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-smooth font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5 mr-3 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                My Resume
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 transition-smooth font-medium flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-3 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-white/20">
              <AuthDialog />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
