"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center bg-[url(/resumethumb2.jpg)] bg-cover bg-center">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="text-responsive-4xl font-bold text-white mb-6 animate-fade-in-up">
              Stand out with professional custom resumes
            </h1>
            <p className="text-responsive-lg text-gray-100 mb-8 animate-fade-in-up delay-200">
              Let your qualifications shine with an exceptional CV, designed
              with ease and made to stand out from the crowd.
            </p>
            <Link href="/design">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-smooth hover-lift shadow-premium animate-fade-in-up delay-300">
                Get Started
                <svg
                  className="inline-block ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-responsive-3xl font-bold text-gray-900 mb-4">
              Why Choose SimpleResu?
            </h2>
            <p className="text-responsive-base text-gray-600 max-w-2xl mx-auto">
              Create professional resumes in minutes with our powerful,
              easy-to-use builder
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover-lift transition-smooth animate-fade-in-up delay-100">
              <div className="w-16 h-16 bg-gradient-blue rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Professional Templates
              </h3>
              <p className="text-gray-600">
                Choose from ATS-friendly templates designed by professionals to
                help you land your dream job.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover-lift transition-smooth animate-fade-in-up delay-200">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Easy Customization
              </h3>
              <p className="text-gray-600">
                Customize colors, fonts, and layouts with our intuitive editor.
                Make your resume truly yours.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover-lift transition-smooth animate-fade-in-up delay-300">
              <div className="w-16 h-16 bg-gradient-sunset rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Download & Share
              </h3>
              <p className="text-gray-600">
                Export your resume as PDF or DOCX. Share it online or print it
                for job applications.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
