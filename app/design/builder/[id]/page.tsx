"use client";

import { useState, useCallback, useEffect, Suspense, use } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "@/lib/useDebouncedCallback";
import { Button } from "@/components/ui/button";
import { CustomizePanel } from "@/components/CustomizePanel";
import {
  ResumeTemplateId,
  TEMPLATE_CUSTOMIZATION,
} from "@/lib/resumeTemplateConfig";
import { FormPersonalData } from "@/components/formPersonalData";
import { FormEmploymentHistory } from "@/components/formEmplymntHstry";
import { FormEducation } from "@/components/formEducation";
import { FormSkills } from "@/components/formSkills";
import { FormExtras } from "@/components/formExtras";
import { AtsTemplate } from "@/components/AtsTemplate";
import { ExecutiveClassicTemplate } from "@/components/ExecutiveClassicTemplate";
import { ModernTechTemplate } from "@/components/ModernTechTemplate";
import {
  ResumeData,
  ProfileSection,
  ExperienceItem,
  EducationItem,
  ExtrasSection,
  ThemeConfig,
} from "@/types/resume";
import { useToast } from "@/contexts/toastContext";
import Link from "next/link";
import {
  MoreVertical,
  ChevronLeft,
  Layout,
  Settings,
  Eye,
  FileText,
  Save,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { resumeApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Map templateId from backend (e.g. "ats-1") to local builder template key
function backendTemplateToLocal(tid?: string): ResumeTemplateId {
  if (tid === "executive-1") return "executive";
  if (tid === "modern-tech-1") return "modern-tech";
  return "ats";
}

// Map local builder template key to backend templateId
function localTemplateToBackend(key: ResumeTemplateId): string {
  if (key === "executive") return "executive-1";
  if (key === "modern-tech") return "modern-tech-1";
  return "ats-1";
}

function Builder({ resumeId }: { resumeId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"content" | "customize">(
    "content",
  );
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [template, setTemplate] = useState<ResumeTemplateId>("ats");

  const defaultStyles: ThemeConfig = {
    fontFamily: "",
    fontSize: "11",
    pagePadding: "10",
  };

  const defaultResume: ResumeData = {
    profile: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      summary: "",
      links: [],
    },
    experience: [],
    education: [],
    skills: [],
    extras: { certifications: [], languages: [], projects: [] },
  };

  const [resumeStyles, setResumeStyles] = useState<ThemeConfig>(defaultStyles);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResume);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    data: fetchedResume,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["resume", resumeId],
    queryFn: () => resumeApi.getResumeById(resumeId!),
    enabled: !!resumeId,
    staleTime: 0,
  });

  useEffect(() => {
    if (fetchedResume && !isInitialized) {
      const data = fetchedResume.data || defaultResume;
      setResumeData({
        profile: data.profile || defaultResume.profile,
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        extras: data.extras || defaultResume.extras,
      });

      const tid =
        (fetchedResume as any).template_id ?? fetchedResume.templateId;
      setTemplate(backendTemplateToLocal(tid));

      if (data.theme) {
        setResumeStyles({
          fontFamily: data.theme.fontFamily || "",
          fontSize: data.theme.fontSize?.replace("px", "") || "11",
          pagePadding: data.theme.pagePadding?.replace("mm", "") || "10",
        });
      }

      setIsInitialized(true);
    }
  }, [fetchedResume, isInitialized]);

  // ─── Save mutations ───
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!resumeId) throw new Error("No resume ID");

      const cleanSkills = (resumeData.skills || []).filter(
        (s) => s.trim().length > 0,
      );
      const cleanExperience = (resumeData.experience || [])
        .filter((e) => e.company?.trim() && e.role?.trim() && e.start)
        .map((e) => ({
          ...e,
          end: e.end || undefined,
          highlights: (e.highlights || []).filter((h) => h.trim().length > 0),
        }));

      const cleanEducation = (resumeData.education || [])
        .filter((e) => e.college?.trim() && e.start)
        .map((e) => ({
          ...e,
          end: e.end || undefined,
        }));

      // Profile: strip empty optional fields, only send if fullName isn't empty
      const rawProfile: any = resumeData.profile || {};
      const cleanProfile = {
        fullName: rawProfile.fullName?.trim() || "Untitled",
        headline: rawProfile.headline?.trim() || undefined,
        avatarUrl: rawProfile.avatarUrl?.trim() || undefined,
        email: rawProfile.email?.trim() || undefined,
        phone: rawProfile.phone?.trim() || undefined,
        location: rawProfile.location?.trim() || undefined,
        summary: rawProfile.summary?.trim() || undefined,
        links: (rawProfile.links || []).filter(
          (l: any) => l.url && l.url.trim().length > 0,
        ),
      };

      // Extras: filter out empty entries
      const rawExtras = resumeData.extras || defaultResume.extras!;
      const cleanExtras = {
        certifications: (rawExtras.certifications || [])
          .filter((c) => c.name?.trim())
          .map((c) => ({
            ...c,
            date: c.date || undefined,
            url: c.url?.trim() || undefined,
          })),
        languages: (rawExtras.languages || []).filter((l) => l.name?.trim()),
        projects: (rawExtras.projects || [])
          .filter((p) => p.name?.trim())
          .map((p) => ({
            ...p,
            url: p.url?.trim() || undefined,
          })),
      };

      // Theme: ensure fontFamily is not empty
      const cleanTheme: ThemeConfig = {
        fontFamily: resumeStyles.fontFamily || "sans-serif",
        fontSize: `${resumeStyles.fontSize || "11"}px`,
        pagePadding: `${resumeStyles.pagePadding || "10"}mm`,
      };

      // Save sections SEQUENTIALLY to avoid race condition
      // (each patchSectionById does read→merge→write on the same `data` column)
      await resumeApi.updateResumeProfile(resumeId, {
        profile: cleanProfile as any,
      });
      await resumeApi.updateResumeExperience(resumeId, {
        experience: cleanExperience as any,
      });
      await resumeApi.updateResumeEducation(resumeId, {
        education: cleanEducation as any,
      });
      await resumeApi.updateResumeSkills(resumeId, {
        skills: cleanSkills,
      });
      await resumeApi.updateResumeExtras(resumeId, {
        extras: cleanExtras as any,
      });
      await resumeApi.updateResumeTheme(resumeId, {
        theme: cleanTheme,
      });
      // Meta writes to separate columns (title, template_id), safe to run last
      await resumeApi.updateResumeMeta(resumeId, {
        templateId: localTemplateToBackend(template) as any,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume", resumeId] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setLastSaved(Date.now());
      showToast("Saved successfully", "success");
    },
    onError: (err: any) => {
      console.warn("Failed to save resume", err);
      console.error("Backend response:", err?.response?.data);
      showToast("Save failed", "error");
    },
  });

  const handleStylesChange = useCallback(
    (next: Partial<ThemeConfig>) => {
      setResumeStyles((prev) => {
        return { ...prev, ...next };
      });
    },
    [template],
  );

  const handleStylesReset = useCallback(() => {
    setResumeStyles(defaultStyles);
  }, []);

  const handlePersonalChange = useCallback((p: Partial<ProfileSection>) => {
    setResumeData((prev) => ({
      ...prev,
      profile: { ...(prev.profile || {}), ...p } as ProfileSection,
    }));
  }, []);

  const handleEmploymentChange = useCallback((e: ExperienceItem[]) => {
    setResumeData((prev) => ({ ...prev, experience: e }));
  }, []);

  const handleEducationChange = useCallback((e: EducationItem[]) => {
    setResumeData((prev) => ({ ...prev, education: e }));
  }, []);

  const handleSkillsChange = useCallback(
    (s: { id: string; skillName: string }[]) => {
      setResumeData((prev) => ({
        ...prev,
        skills: s.map((item) => item.skillName),
      }));
    },
    [],
  );

  const handleExtrasChange = useCallback((ex: ExtrasSection) => {
    setResumeData((prev) => ({ ...prev, extras: ex }));
  }, []);

  // debounced wrappers
  const [debouncedPersonalChange, flushPersonalChange] = useDebouncedCallback(
    handlePersonalChange,
    250,
  );
  const [debouncedEmploymentChange, flushEmploymentChange] =
    useDebouncedCallback(handleEmploymentChange, 250);
  const [debouncedEducationChange, flushEducationChange] = useDebouncedCallback(
    handleEducationChange,
    250,
  );
  const [debouncedSkillsChange, flushSkillsChange] = useDebouncedCallback(
    handleSkillsChange,
    250,
  );
  const [debouncedExtrasChange, flushExtrasChange] = useDebouncedCallback(
    handleExtrasChange,
    250,
  );

  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const getSavedStatus = () => {
    if (!mounted) return "";
    if (saveMutation.isPending) return "Saving...";
    if (!lastSaved) return "Not saved";
    const diff = Date.now() - lastSaved;
    if (diff < 5000) return "Saved just now";
    if (diff < 60000) return `Saved ${Math.round(diff / 1000)}s ago`;
    if (diff < 3600000) return `Saved ${Math.round(diff / 60000)}m ago`;
    return `Saved ${Math.round(diff / 3600000)}h ago`;
  };

  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert to ThemeConfig with units for template rendering
  const themeStyles: ThemeConfig = {
    fontFamily: resumeStyles.fontFamily,
    fontSize: `${resumeStyles.fontSize || "11"}px`,
    pagePadding: `${resumeStyles.pagePadding || "10"}mm`,
  };

  const handleSaveNow = () => {
    // Flush pending debounced updates first
    try {
      flushPersonalChange();
      flushEmploymentChange();
      flushEducationChange();
      flushSkillsChange();
      flushExtrasChange();
    } catch (e) {
      // ignore
    }

    // Small timeout to allow flushed callbacks to update state
    setTimeout(() => {
      saveMutation.mutate();
    }, 0);
  };

  const handleResetNow = () => {
    const ok = window.confirm(
      "Reset resume and clear all data? This cannot be undone.",
    );
    if (!ok) return;
    setResumeData(defaultResume);
    setResumeStyles(defaultStyles);
    showToast("Reset complete — click Save to persist changes", "success");
    setLastSaved(null);
  };

  const handleFinishSave = () => {
    // Flush pending debounced updates first
    try {
      flushPersonalChange();
      flushEmploymentChange();
      flushEducationChange();
      flushSkillsChange();
      flushExtrasChange();
    } catch (e) {
      // ignore
    }

    // Small timeout to allow flushed callbacks to update state, then save & redirect
    setTimeout(() => {
      saveMutation.mutate(undefined, {
        onSuccess: () => {
          router.push("/my-resume");
        },
      });
    }, 0);
  };

  // ─── Loading / error states ───

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-semibold animate-pulse">
          Crafting your resume...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-premium max-w-md w-full text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Failed to load resume
          </h2>
          <p className="text-slate-500 mb-8">
            {(fetchError as any)?.message ||
              "Something went wrong. Please check your connection and try again."}
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-gradient-blue hover-lift"
              onClick={() => router.replace("/design")}
            >
              Back to Templates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] font-sans">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm flex-shrink-0">
        <div className="max-w-[1920px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-slate-100 transition-all text-slate-600 shrink-0"
              onClick={() => router.back()}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6" />
            </Button>
            <div className="hidden sm:block h-8 w-[1px] bg-slate-200" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-slate-900 truncate max-w-[120px] sm:max-w-none">
                ResuBuilder
              </h1>
              <div className="hidden sm:flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Editing Resume
                </span>
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <div className="hidden md:flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === "content"
                  ? "bg-white text-blue-600 shadow-premium"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              Content
            </button>
            <button
              onClick={() => setActiveTab("customize")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === "customize"
                  ? "bg-white text-blue-600 shadow-premium"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Settings className="w-4 h-4" />
              Customize
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Status */}
            <div className="hidden xl:flex items-center mr-2 pr-4 border-r border-slate-200">
              <span className="text-[11px] font-medium text-slate-400">
                {mounted ? getSavedStatus() : ""}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-slate-100 transition-all text-slate-600 shrink-0"
                >
                  <MoreVertical className="w-5 h-5 sm:w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-2 rounded-2xl shadow-premium border-slate-100 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Quick Actions
                  </p>
                </div>
                <DropdownMenuItem
                  onClick={handleSaveNow}
                  disabled={saveMutation.isPending}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer focus:bg-blue-50 focus:text-blue-600 transition-smooth group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-focus:bg-blue-100 transition-colors">
                    {saveMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm">Save Changes</p>
                    <p className="text-[10px] text-slate-500">
                      Persist your progress
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-50 my-1" />
                <DropdownMenuItem
                  onClick={handleResetNow}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 transition-smooth group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-focus:bg-red-100 transition-colors">
                    <RotateCcw className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Reset Resume</p>
                    <p className="text-[10px] text-red-400/70">
                      Clear all sections
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Mini-status & Secondary Actions */}
        <div className="md:hidden flex items-center justify-between px-4 pb-3 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-1.5 h-1.5 rounded-full ${saveMutation.isPending ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}
            />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              {mounted ? getSavedStatus() : ""}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-[11px] font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={() =>
                setActiveTab(activeTab === "content" ? "customize" : "content")
              }
            >
              <Layout className="w-3.5 h-3.5 mr-1.5" />
              {activeTab === "content" ? "Style" : "Edit"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Designer Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Mobile View Toggle */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex bg-white/90 backdrop-blur-xl p-1 rounded-2xl shadow-premium border border-slate-200/60 transition-all">
          <button
            onClick={() => setMobileView("edit")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mobileView === "edit"
                ? "bg-blue-600 text-white shadow-blue"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Editor
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mobileView === "preview"
                ? "bg-blue-600 text-white shadow-blue"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>

        {/* Left Section: Form / Customizer */}
        <section
          className={`flex-1 w-full lg:w-[45%] xl:w-[40%] bg-white lg:border-r border-slate-200/60 overflow-y-auto min-h-0 transition-opacity duration-300 ${
            mobileView === "preview"
              ? "hidden lg:block lg:opacity-100"
              : "block"
          }`}
        >
          <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            {activeTab === "content" ? (
              <div className="space-y-8 animate-fade-in-up">
                {/* Section Header */}
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {step === 1 && "Personal Information"}
                    {step === 2 && "Experience & Roles"}
                    {step === 3 && "Educational Background"}
                    {step === 4 && "Core Skills"}
                    {step === 5 && "Additional Sections"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Fill in your details accurately to craft a professional
                    story.
                  </p>

                  {/* Step Progress Mini-bar */}
                  <div className="flex gap-1.5 mt-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          i < step
                            ? "bg-blue-600"
                            : i === step
                              ? "bg-blue-600 w-full"
                              : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-3xl p-5 sm:p-6 border border-slate-100">
                  {step === 1 && (
                    <FormPersonalData
                      setStep={setStep}
                      onChangePersonal={debouncedPersonalChange}
                      initial={resumeData.profile}
                    />
                  )}
                  {step === 2 && (
                    <FormEmploymentHistory
                      setStep={setStep}
                      step={step}
                      onChangeEmployment={debouncedEmploymentChange}
                      initial={resumeData.experience}
                    />
                  )}
                  {step === 3 && (
                    <FormEducation
                      setStep={setStep}
                      step={step}
                      onChangeEducation={debouncedEducationChange}
                      initial={resumeData.education}
                    />
                  )}
                  {step === 4 && (
                    <FormSkills
                      setStep={setStep}
                      step={step}
                      onChangeSkills={debouncedSkillsChange}
                      initial={resumeData.skills as any}
                    />
                  )}
                  {step === 5 && (
                    <FormExtras
                      setStep={setStep}
                      step={step}
                      onChangeExtras={debouncedExtrasChange}
                      initial={resumeData.extras}
                      onFinishSave={handleFinishSave}
                      isSaving={saveMutation.isPending}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Design & Layout
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Customize the look and feel to match your personal brand.
                  </p>
                </div>
                <div className="bg-slate-50/50 rounded-3xl p-5 sm:p-6 border border-slate-100">
                  <CustomizePanel
                    templateId={template}
                    styles={resumeStyles}
                    onChange={handleStylesChange}
                    onReset={handleStylesReset}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Section: Interactive Live Preview */}
        <section
          className={`flex-1 bg-slate-100 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-10 flex justify-center transition-all duration-500 ${
            mobileView === "edit" ? "hidden lg:flex" : "flex translate-x-0"
          }`}
        >
          <div className="relative group/preview-area">
            {/* Resume Canvas Container */}
            <div className="w-[210mm] h-fit origin-top transition-transform duration-500 hover:scale-[1.01] scale-[0.45] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.6] xl:scale-[0.8] 2xl:scale-100">
              {mounted ? (
                <div className="shadow-2xl shadow-blue-900/10 rounded-sm overflow-hidden">
                  {template === "executive" ? (
                    <ExecutiveClassicTemplate
                      data={resumeData}
                      styles={themeStyles}
                    />
                  ) : template === "modern-tech" ? (
                    <ModernTechTemplate
                      data={resumeData}
                      styles={themeStyles}
                    />
                  ) : (
                    <AtsTemplate data={resumeData} styles={themeStyles} />
                  )}
                </div>
              ) : (
                <div
                  className="w-[210mm] min-h-[297mm] mx-auto p-12 bg-white rounded-sm shadow-xl animate-pulse flex flex-col gap-6"
                  aria-hidden
                >
                  <div className="h-10 w-1/3 bg-slate-100 rounded-lg" />
                  <div className="h-4 w-full bg-slate-50 rounded" />
                  <div className="h-4 w-5/6 bg-slate-50 rounded" />
                  <div className="mt-12 h-64 w-full bg-slate-100 rounded-xl" />
                </div>
              )}
            </div>
            <div className="h-20 lg:h-0" /> {/* Mobile Spacer */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Builder resumeId={id} />
    </Suspense>
  );
}
