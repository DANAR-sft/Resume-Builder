"use client";

import { Suspense, use } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { resumeApi } from "@/lib/api";
import { AtsTemplate } from "@/components/AtsTemplate";
import { ExecutiveClassicTemplate } from "@/components/ExecutiveClassicTemplate";
import { ModernTechTemplate } from "@/components/ModernTechTemplate";
import type { Resume, ThemeConfig } from "@/types/resume";
import jsPDF from "jspdf";
import { ArrowLeft, Pencil, FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

import { exportResumeToPdfNative } from "@/lib/pdf-export";

function renderTemplatePreview(resume: Resume) {
  const data = resume.data ?? {};
  const tid = (resume as any).template_id ?? resume.templateId ?? "";

  // parse the theme as ThemeConfig
  const theme = data.theme || {};
  const themeStyles: ThemeConfig = {
    fontFamily: theme.fontFamily || "sans-serif",
    fontSize: theme.fontSize || "11px",
    pagePadding: theme.pagePadding || "10mm",
  };

  if (tid.startsWith("executive"))
    return <ExecutiveClassicTemplate data={data} styles={themeStyles} />;
  if (tid.startsWith("modern-tech"))
    return <ModernTechTemplate data={data} styles={themeStyles} />;

  return <AtsTemplate data={data} styles={themeStyles} />;
}

function DetailResumeContent({ resumeId }: { resumeId: string }) {
  const router = useRouter();

  const {
    data: resume,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["resume", resumeId],
    queryFn: () => resumeApi.getResumeById(resumeId),
    enabled: !!resumeId,
  });

  let content;

  if (isLoading) {
    content = (
      <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-semibold animate-pulse">
          Loading resume details...
        </p>
      </div>
    );
  } else if (isError || !resume) {
    content = (
      <div className="flex items-center justify-center flex-1 p-4 min-h-[50vh]">
        <div className="bg-white p-8 rounded-3xl shadow-premium max-w-md w-full text-center border border-slate-100 mt-8">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Failed to load resume
          </h2>
          <p className="text-slate-500 mb-8">
            The resume could not be found or an error occurred.
          </p>
          <Button
            className="w-full bg-gradient-blue"
            onClick={() => router.push("/my-resume")}
          >
            Back to My Resumes
          </Button>
        </div>
      </div>
    );
  } else {
    content = (
      <main className="flex-1 w-full flex flex-col pt-0">
        {/* Premium Header Strip */}
        <div className="bg-gradient-blue pt-8 pb-16 sm:pt-12 sm:pb-24 px-4 sm:px-6 lg:px-8 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-inner relative z-0 ">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-white animate-fade-in-up">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border-0 transition-smooth"
                onClick={() => router.push("/my-resume")}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white truncate drop-shadow-sm tracking-tight">
                  {resume.title || "Untitled Resume"}
                </h1>
                <p className="text-blue-100 font-medium mt-1 truncate flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  {resume.data?.profile?.fullName || "No Name"}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-3 w-full md:w-auto animate-fade-in-up delay-100">
              <Button
                variant="outline"
                className="flex-1 md:flex-none h-12 rounded-xl font-bold gap-2 bg-white/10 border-white/20 hover:bg-white/20 text-white shadow-sm transition-all"
                onClick={() => router.push(`/design/builder/${resume.id}`)}
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </Button>
              <Button
                className="flex-1 md:flex-none h-12 rounded-xl font-bold gap-2 bg-white text-blue-700 hover:bg-gray-50 hover:text-blue-800 shadow-premium transition-all hover-lift"
                onClick={() => exportResumeToPdfNative(resume)}
              >
                <FileDown className="w-4 h-4" />
                <span>Export PDF</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Resume Canvas Container (Pulled up over the header) */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 -mt-8 sm:-mt-14 pb-12 flex justify-center relative z-10 animate-fade-in-up delay-200">
          <div className="relative group/preview-area w-full max-w-5xl bg-slate-50/80 sm:bg-white/80 backdrop-blur-md sm:rounded-[2.5rem] p-4 py-8 sm:p-10 lg:p-12 border-0 sm:border border-white shadow-premium overflow-hidden flex flex-col items-center">
            {/* Dynamic Height Wrapper to remove scaling empty space */}
            <div
              ref={(el) => {
                if (!el) return;
                // Self-executing resize monitor for the wrapper
                const handleResize = () => {
                  const inner = el.firstElementChild as HTMLElement;
                  if (inner) {
                    const rect = inner.getBoundingClientRect();
                    el.style.height = `${rect.height}px`;
                    el.style.width = `${rect.width}px`;
                  }
                };
                // Run once
                setTimeout(handleResize, 100);
                // Setup observers if not already done
                if (!(el as any)._hasObserver) {
                  (el as any)._hasObserver = true;
                  const observer = new ResizeObserver(handleResize);
                  if (el.firstElementChild)
                    observer.observe(el.firstElementChild);
                  window.addEventListener("resize", handleResize);
                }
              }}
              className="relative transition-all duration-300 ease-out"
            >
              {/* Scale container based on screen size to create a responsive viewing area */}
              <div className="w-[800px] sm:w-[210mm] origin-top-left md:origin-top transition-transform duration-500 scale-[0.38] min-[400px]:scale-[0.45] min-[500px]:scale-[0.55] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.9] xl:scale-100 flex justify-center pb-8 sm:pb-0">
                <div className="shadow-2xl shadow-blue-900/20 rounded-sm overflow-hidden bg-white ring-1 ring-slate-900/5 cursor-crosshair">
                  {renderTemplatePreview(resume)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white font-sans">
      <Navbar />
      {content}
      <Footer />
    </div>
  );
}

export default function DetailResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense>
      <DetailResumeContent resumeId={id} />
    </Suspense>
  );
}
