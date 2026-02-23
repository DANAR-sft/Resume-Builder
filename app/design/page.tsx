"use client";

import { Navbar } from "@/components/navbar";
import { AtsTemplate } from "@/components/AtsTemplate";
import { ExecutiveClassicTemplate } from "@/components/ExecutiveClassicTemplate";
import { ModernTechTemplate } from "@/components/ModernTechTemplate";
import { useMemo, useState } from "react";
import { ResumeData, CreateResumeRequest } from "@/types/resume";
import { Footer } from "@/components/footer";
import { DialogCreateResume } from "@/components/DialogCreateResume";
import { resumeApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type TemplateKey = "ats" | "executive" | "modern-tech" | "minimalist-creative";
type FilterKey =
  | "all"
  | "simple"
  | "word"
  | "picture"
  | "ats"
  | "two-column"
  | "google-docs";

type TemplateItem = {
  key: TemplateKey;
  title: string;
  description: string;
  tags: FilterKey[];
  preview: (data: ResumeData) => React.ReactNode;
};

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex-shrink-0 rounded-full border-2 border-blue-500 bg-gradient-blue px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-smooth"
          : "flex-shrink-0 rounded-full border-2 border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-smooth"
      }
    >
      {children}
    </button>
  );
}

// Map local template key to backend templateId
function localKeyToBackendId(key: TemplateKey): string {
  if (key === "executive") return "executive-1";
  if (key === "modern-tech") return "modern-tech-1";
  return "ats-1";
}

function TemplateCard({
  item,
  data,
}: {
  item: TemplateItem;
  data: ResumeData;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (req: CreateResumeRequest) => resumeApi.createResume(req),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      router.push(`/design/builder/${result.id}`);
    },
  });

  const handleUseTemplate = () => {
    if (createMutation.isPending) return;
    createMutation.mutate({
      title: `${item.title} Resume`,
      templateId: localKeyToBackendId(item.key) as any,
    });
  };

  return (
    <div className="group animate-fade-in-up">
      <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg hover-lift transition-smooth">
        <div className="bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="relative mx-auto h-[380px] sm:h-[420px] max-w-[360px] overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-md">
            <div className="absolute left-0 top-0 origin-top-left scale-[0.33]">
              {item.preview(data)}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
              <button
                onClick={handleUseTemplate}
                disabled={createMutation.isPending}
                className="rounded-lg bg-white text-blue-600 px-6 py-3 text-sm font-bold shadow-premium hover:bg-gray-100 transition-smooth transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
              >
                {createMutation.isPending
                  ? "Creating..."
                  : "Use this template →"}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <span className="rounded-md bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700">
              PDF
            </span>
            <span className="rounded-md bg-purple-100 px-2.5 py-1 text-[10px] font-bold text-purple-700">
              DOCX
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 px-2">
        <div className="text-lg font-bold text-gray-900 mb-1">{item.title}</div>
        <div className="text-sm text-gray-600 leading-relaxed">
          {item.description}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const sampleData: ResumeData = useMemo(
    () => ({
      profile: {
        fullName: "Sophie Walton",
        headline: "Product Manager",
        email: "sophie.walton@email.com",
        phone: "+62 812-3456-7890",
        location: "Jakarta, Indonesia",
        summary:
          "Product leader with 6+ years building consumer SaaS. Strong in discovery, roadmap, and cross-functional execution. Focused on measurable outcomes and clear communication.",
        links: [
          { url: "linkedin.com/in/sophiewalton" },
          { url: "github.com/sophiew" },
        ],
      },
      experience: [
        {
          id: "job-1",
          company: "Howard Jones",
          role: "Senior Product Manager",
          employment_type: "Full-time",
          start: "2022",
          end: "Present",
          location: "Remote",
          highlights: [
            "Led onboarding revamp, improving activation +18%.",
            "Shipped analytics events + dashboards for funnels.",
            "Partnered with engineering to cut cycle time 22%.",
          ],
        },
        {
          id: "job-2",
          company: "Dubon Partnership",
          role: "Product Manager",
          employment_type: "Full-time",
          start: "2020",
          end: "2022",
          location: "Jakarta",
          highlights: [
            "Owned roadmap for B2B admin platform.",
            "Improved NPS by standardizing support workflows.",
          ],
        },
      ],
      education: [
        {
          id: "edu-1",
          college: "University of Pennsylvania",
          degree: "B.Sc.",
          field: "Business Analytics",
          start: "2016",
          end: "2020",
          gpa: "3.8",
        },
      ],
      skills: [
        "Product Strategy",
        "User Research",
        "SQL",
        "Figma",
        "Agile",
        "Stakeholder Mgmt",
      ],
      extras: {
        certifications: [
          {
            name: "Google Project Management",
            issuer: "Coursera",
            date: "2023",
            url: undefined,
          },
        ],
        languages: [
          { name: "English", level: "Professional" },
          { name: "Bahasa", level: "Native" },
        ],
        projects: [
          {
            name: "Portfolio",
            description: "Selected case studies and product write-ups.",
            url: "sophiewalton.dev",
          },
        ],
      },
    }),
    [],
  );

  const templates: TemplateItem[] = useMemo(
    () => [
      {
        key: "ats",
        title: "ATS",
        description: "Black & white, recruiter-friendly and high density.",
        tags: ["ats", "simple", "word"],
        preview: (data) => <AtsTemplate data={data} />,
      },
      {
        key: "executive",
        title: "Executive",
        description: "Classically structured template for corporate rigor.",
        tags: ["simple", "word"],
        preview: (data) => <ExecutiveClassicTemplate data={data} />,
      },
      {
        key: "modern-tech",
        title: "Modern Tech",
        description: "Clean two-column layout for technical hierarchy.",
        tags: ["two-column", "word"],
        preview: (data) => <ModernTechTemplate data={data} />,
      },
    ],
    [],
  );

  const visibleTemplates = useMemo(() => {
    if (filter === "all") return templates;
    return templates.filter((t) => t.tags.includes(filter));
  }, [filter, templates]);

  return (
    <>
      <Navbar />
      <div className="w-full bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 md:py-16 text-center">
            <h1 className="text-responsive-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              Resume templates
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-responsive-base text-gray-600 leading-relaxed animate-fade-in delay-100">
              Each resume template is designed to follow the exact rules you
              need to get hired faster. Pick a template, then fill your resume
              details.
            </p>
            <div className="mt-8 flex justify-center gap-4 animate-fade-in delay-200">
              <DialogCreateResume />
            </div>
          </div>

          <div className="pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {visibleTemplates.map((t, idx) => (
                <div key={t.key} className={`delay-${(idx + 1) * 100}`}>
                  <TemplateCard item={t} data={sampleData} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
