"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useState } from "react";

const faqs = [
  {
    question: "How do I start building my resume?",
    answer:
      "Getting started is easy! Simply click on the 'Get Started' button on the home page, choose a template that fits your style, and start filling in your professional details.",
  },
  {
    question: "Is SimpleResu free to use?",
    answer:
      "We offer a variety of free templates and features. We also have premium options for users who want more advanced customization and exclusive designs.",
  },
  {
    question: "Can I download my resume as a PDF?",
    answer:
      "Yes, you can download your completed resume in PDF format, which is the most widely accepted format for job applications.",
  },
  {
    question: "Are the templates ATS-friendly?",
    answer:
      "Absolutely. Our templates are specifically designed to be easily read by Applicant Tracking Systems (ATS), ensuring your resume reaches human recruiters.",
  },
  {
    question: "How can I contact support?",
    answer:
      "If you need any help, you can reach out to our customer service team via the contact form below or email us directly at support@simpleresu.com.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-gradient-blue py-16 md:py-24 px-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-responsive-4xl font-bold text-white mb-4 animate-fade-in-down">
              How can we help you?
            </h1>
            <p className="text-responsive-lg text-white/90 animate-fade-in-up md:max-w-2xl mx-auto">
              Find answers to common questions or reach out to our support team
              for personalized assistance.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-responsive-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-smooth hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                  >
                    <span className="text-lg font-semibold text-gray-800">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-6 h-6 text-blue-500 transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
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
                    className={`px-6 transition-all duration-300 ease-in-out ${
                      openIndex === index
                        ? "max-h-40 pb-5 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-white px-4 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              {/* Contact Info */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-responsive-3xl font-bold text-gray-900 mb-6">
                  Still have questions?
                </h2>
                <p className="text-responsive-base text-gray-600 mb-10">
                  Our professional support team is ready to help you create your
                  perfect resume. Reach out to us through any of these channels.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover-lift transition-smooth">
                    <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Email Support
                      </h3>
                      <p className="text-gray-600">support@simpleresu.com</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Response time: Usually within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover-lift transition-smooth">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Live Chat
                      </h3>
                      <p className="text-gray-600">
                        Available Mon-Fri, 9am - 5pm EST
                      </p>
                      <button className="mt-3 text-blue-600 font-semibold hover:underline flex items-center gap-1">
                        Start Chat
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form Placeholder */}
              <div className="w-full lg:w-1/2 p-1 bg-gradient-blue rounded-3xl shadow-premium">
                <div className="bg-white p-8 md:p-10 rounded-[calc(1.5rem-4px)]">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Send us a message
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-smooth"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-smooth"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-smooth"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-smooth min-h-[150px]"
                        placeholder="Tell us more about your issue..."
                      ></textarea>
                    </div>
                    <button className="w-full bg-gradient-blue text-white py-4 rounded-xl font-bold shadow-glow hover:shadow-glow-lg transition-smooth hover-lift active:scale-95">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
