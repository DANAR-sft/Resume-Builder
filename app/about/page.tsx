"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-blue overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-responsive-4xl font-bold text-white mb-6 animate-fade-in-down">
              About SimpleResu
            </h1>
            <p className="text-responsive-lg text-blue-50 max-w-3xl mx-auto animate-fade-in-up delay-100">
              Empowering job seekers with the tools to create professional,
              ATS-friendly resumes that stand out in today's competitive job
              market.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6 animate-slide-in-left">
                <h2 className="text-responsive-3xl font-bold text-gray-900">
                  Our Mission
                </h2>
                <p className="text-responsive-base text-gray-600 leading-relaxed">
                  SimpleResu was built with a single goal in mind: to simplify
                  the resume-building process without compromising on quality.
                  We believe that everyone deserves a fair shot at their dream
                  job, and a great resume is the first step toward that.
                </p>
                <p className="text-responsive-base text-gray-600 leading-relaxed">
                  Our platform combines intuitive design with professional
                  templates, ensuring your qualifications are presented in the
                  most impactful way possible.
                </p>
                <div className="pt-4">
                  <Link href="/design">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-smooth hover-lift shadow-lg">
                      Build Your Resume Now
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 animate-slide-in-right delay-200">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-blue rounded-2xl blur-2xl opacity-20"></div>
                  <div className="relative bg-white p-8 rounded-2xl shadow-premium border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "resumethumb.jpg",
                        "resumethumb2.jpg",
                        "resumethumb3.jpg",
                        "resumethumb4.jpg",
                      ].map((i, index) => (
                        <div
                          key={index}
                          className="h-32 bg-gray-50 rounded-lg flex items-center justify-center"
                        >
                          <Image
                            src={`/${i}`}
                            alt="Resume Preview"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-responsive-3xl font-bold text-gray-900 mb-4 animate-fade-in">
                Meet Our Team
              </h2>
              <p className="text-responsive-base text-gray-600 max-w-2xl mx-auto animate-fade-in delay-100">
                The passionate individuals building the future of career
                development.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-8">
              {/* Danar - Frontend */}
              <div className="flex-1 max-w-sm bg-white rounded-3xl p-8 shadow-premium border border-gray-100 items-center justify-center flex flex-col hover-lift transition-smooth animate-fade-in-up delay-200">
                <div className="w-24 h-24 bg-gradient-blue rounded-full mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  D
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Danar</h3>
                <p className="text-blue-600 font-semibold mb-4">
                  Frontend Developer
                </p>
                <p className="text-gray-600 text-center">
                  Specializing in creating beautiful, responsive, and intuitive
                  user experiences that make building resumes a breeze.
                </p>
              </div>

              {/* Yudha - Backend */}
              <div className="flex-1 max-w-sm bg-white rounded-3xl p-8 shadow-premium border border-gray-100 flex flex-col items-center justify-center hover-lift transition-smooth animate-fade-in-up delay-300">
                <div className="w-24 h-24 bg-gradient-primary rounded-full mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  Y
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Yudha</h3>
                <p className="text-purple-600 font-semibold mb-4">
                  Backend Developer
                </p>
                <p className="text-gray-600 text-center">
                  Ensuring the platform is fast, secure, and reliable, handling
                  all the complex logic that powers our resume generation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-primary rounded-3xl p-12 text-center text-white shadow-premium animate-pulse-slow">
              <h2 className="text-responsive-3xl font-bold mb-6">
                Ready to take the next step?
              </h2>
              <p className="text-responsive-lg mb-8 opacity-90">
                Join thousands of users who have successfully landed jobs using
                SimpleResu.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/design">
                  <button className="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover-scale transition-smooth shadow-lg">
                    Build My Resume
                  </button>
                </Link>
                <Link href="/help">
                  <button className="w-full sm:w-auto glass hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-smooth border border-white/30">
                    Get Support
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
