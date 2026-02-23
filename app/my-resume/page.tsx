"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "@/lib/api";
import type { Resume } from "@/types/resume";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/toastContext";
import {
  MoreVertical,
  Pencil,
  FileDown,
  Trash2,
  FileText,
  Plus,
  Copy,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DialogCreateResume } from "@/components/DialogCreateResume";
import { DialogEditResume } from "@/components/DialogEditResume";
import { AtsTemplate } from "@/components/AtsTemplate";
import { ExecutiveClassicTemplate } from "@/components/ExecutiveClassicTemplate";
import { ModernTechTemplate } from "@/components/ModernTechTemplate";
import jsPDF from "jspdf";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function templateLabel(id: string): string {
  const map: Record<string, string> = {
    "ats-1": "ATS",
    "executive-1": "Executive",
    "modern-tech-1": "Modern Tech",
    ats: "ATS",
    executive: "Executive",
    "modern-tech": "Modern Tech",
    "minimalist-creative": "Minimalist",
  };
  return map[id] ?? id;
}

import { exportResumeToPdfNative } from "@/lib/pdf-export";

function renderTemplatePreviewLocal(resume: Resume) {
  const data = resume.data ?? {};
  const tid = (resume as any).template_id ?? resume.templateId ?? "";

  if (tid.startsWith("executive"))
    return <ExecutiveClassicTemplate data={data} />;
  if (tid.startsWith("modern-tech")) return <ModernTechTemplate data={data} />;

  return <AtsTemplate data={data} />;
}

function renderTemplatePreview(resume: Resume) {
  const data = resume.data ?? {};
  const tid = (resume as any).template_id ?? resume.templateId ?? "";

  if (tid.startsWith("executive"))
    return <ExecutiveClassicTemplate data={data} />;
  if (tid.startsWith("modern-tech")) return <ModernTechTemplate data={data} />;

  return <AtsTemplate data={data} />;
}

function ResumeCard({
  resume,
  onDelete,
  onDuplicate,
  isDeleting,
  isDuplicating,
}: {
  resume: Resume;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isDeleting: boolean;
  isDuplicating: boolean;
}) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const profileName = resume.data?.profile?.fullName;
  const tid = (resume as any).template_id ?? resume.templateId ?? "ats-1";

  return (
    <>
      <div
        className={`group animate-fade-in-up ${isDeleting || isDuplicating ? "opacity-50 pointer-events-none" : ""} `}
      >
        {/* Preview card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg hover-lift transition-smooth">
          <div className="bg-gradient-to-br from-slate-50 to-white p-6">
            {/* Scaled-down resume preview */}
            <div className="relative mx-auto h-[380px] sm:h-[420px] max-w-[360px] overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-md">
              <div className="absolute left-0 top-0 origin-top-left scale-[0.33]">
                {renderTemplatePreviewLocal(resume)}
              </div>

              {/* Gradient hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100" />

              {/* Hover CTA */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <button
                  onClick={() => router.push(`/design/builder/${resume.id}`)}
                  className="rounded-lg bg-white text-blue-600 px-6 py-3 text-sm font-bold shadow-premium hover:bg-gray-100 transition-smooth transform hover:scale-105 cursor-pointer"
                >
                  Edit resume →
                </button>
              </div>
            </div>

            {/* Format badges + 3-dot menu */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="rounded-md bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                  PDF
                </span>
              </div>

              {/* 3-dot dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                    aria-label="Resume actions"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() =>
                      router.push(`/my-resume/detail-resume/${resume.id}`)
                    }
                  >
                    <Pencil className="w-4 h-4" />
                    Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Settings className="w-4 h-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() => router.push(`/design/builder/${resume.id}`)}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Content
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() => onDuplicate(resume.id)}
                    disabled={isDuplicating}
                  >
                    <Copy className="w-4 h-4" />
                    {isDuplicating ? "Duplicating..." : "Duplicate"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() => exportResumeToPdfNative(resume)}
                  >
                    <FileDown className="w-4 h-4" />
                    Export to PDF
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    className="gap-2 cursor-pointer"
                    onClick={() => onDelete(resume.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Title + meta below card */}
        <div className="mt-4 px-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-lg font-bold text-gray-900 truncate">
                {resume.title || "Untitled Resume"}
              </div>
              {profileName && (
                <div className="text-sm text-gray-500 truncate mt-0.5">
                  {profileName}
                </div>
              )}
            </div>
            <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {templateLabel(tid)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
            <span>
              Created{" "}
              {formatDate((resume as any).created_at ?? resume.createdAt)}
            </span>
            <span>•</span>
            <span>
              Updated{" "}
              {formatDate((resume as any).updated_at ?? resume.updatedAt)}
            </span>
          </div>
        </div>
        <div className="border-b border-gray-200 md:border-none my-10"></div>
      </div>

      <DialogEditResume
        resume={resume}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="mx-auto h-[380px] sm:h-[420px] max-w-[360px] rounded-xl border-2 border-gray-100 bg-gray-100" />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="h-5 w-10 rounded-md bg-gray-200" />
            </div>
            <div className="h-6 w-6 rounded bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="mt-4 px-2 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

import { useState } from "react";

export default function MyResumePage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const {
    data: resumes,
    isLoading,
    isError,
    error,
  } = useQuery<Resume[]>({
    queryKey: ["resumes"],
    queryFn: resumeApi.getResumes,
  });

  const deleteMutation = useMutation({
    mutationFn: resumeApi.deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      showToast("Resume deleted", "success");
    },
    onError: () => {
      showToast("Failed to delete resume", "error");
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: resumeApi.duplicateResume,
    onSuccess: (newResume) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      showToast("Resume duplicated", "success");
    },
    onError: () => {
      showToast("Failed to duplicate resume", "error");
    },
  });

  const handleDelete = (id: string) => {
    const ok = window.confirm(
      "Are you sure you want to delete this resume? This action cannot be undone.",
    );
    if (!ok) return;
    deleteMutation.mutate(id);
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id);
  };

  return (
    <>
      <Navbar />

      <section className="w-full bg-gradient-to-b from-white via-gray-50 to-white min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <p className="text-sm text-gray-500">
              {isLoading
                ? "Loading resumes…"
                : resumes
                  ? `${resumes.length} resume${resumes.length !== 1 ? "s" : ""}`
                  : ""}
            </p>
            <DialogCreateResume />
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {(error as Error)?.message ||
                  "Could not load your resumes. Please try again later."}
              </p>
            </div>
          )}

          {!isLoading && !isError && resumes?.length === 0 && (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Plus className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                No resumes yet
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                Create your first resume to get started. Choose a template and
                fill in your details.
              </p>
              <DialogCreateResume />
            </div>
          )}

          {!isLoading && !isError && resumes && resumes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {resumes.map((r) => (
                <ResumeCard
                  key={r.id}
                  resume={r}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === r.id
                  }
                  isDuplicating={
                    duplicateMutation.isPending &&
                    duplicateMutation.variables === r.id
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
