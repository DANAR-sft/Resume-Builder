"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ProfileDropdown({
  isUser,
  handleLogout,
}: {
  isUser: string;
  handleLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 focus:outline-none group"
        aria-expanded={isOpen}
      >
        <Avatar className="h-9 w-9 border-2 border-white/20 transition-all group-hover:border-white/50 shadow-sm">
          <AvatarFallback className="bg-gradient-blue text-white font-bold">
            {isUser.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="hidden lg:block text-white font-medium group-hover:text-gray-100 transition-smooth">
          {isUser}
        </span>
        <svg
          className={cn(
            "w-4 h-4 text-white/70 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={cn(
          "absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-premium border border-gray-100 py-2 z-[100] transition-all duration-300 origin-top-right",
          isOpen
            ? "opacity-100 scale-100 transform translate-y-0"
            : "opacity-0 scale-95 transform -translate-y-2 pointer-events-none",
        )}
      >
        <div className="px-4 py-3 border-b border-gray-50 mb-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Account
          </p>
          <p className="text-sm font-bold text-gray-900 truncate">{isUser}</p>
        </div>

        <div className="px-2 space-y-1">
          <Link
            href="/my-resume/"
            onClick={() => setIsOpen(false)}
            className="block"
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-smooth"
            >
              <svg
                className="w-4 h-4 mr-3"
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
            </Button>
          </Link>

          <Link href="/help" onClick={() => setIsOpen(false)} className="block">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-smooth"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Help Center
            </Button>
          </Link>
        </div>

        <div className="border-t border-gray-50 mt-2 pt-2 px-2">
          <Button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            variant="ghost"
            className="w-full justify-start text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-smooth"
          >
            <svg
              className="w-4 h-4 mr-3"
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
          </Button>
        </div>
      </div>
    </div>
  );
}
