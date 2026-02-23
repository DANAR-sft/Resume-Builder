import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileSection, ProfileLink, LinkType } from "@/types/resume";

const LINK_TYPES: { value: LinkType; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "portfolio", label: "Portfolio" },
  { value: "website", label: "Website" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "medium", label: "Medium" },
  { value: "kaggle", label: "Kaggle" },
  { value: "stackoverflow", label: "Stack Overflow" },
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "other", label: "Other" },
];

interface FormPersonalDataProps {
  setStep: (value: number) => void;
  onChangePersonal?: (p: Partial<ProfileSection>) => void;
}

export function FormPersonalData({
  setStep,
  onChangePersonal,
  initial,
}: FormPersonalDataProps & { initial?: Partial<ProfileSection> }) {
  const [fullName, setFullName] = useState(initial?.fullName || "");
  const [headline, setHeadline] = useState(initial?.headline || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initial?.avatarUrl ?? null,
  );
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [summary, setSummary] = useState(initial?.summary || "");
  const [links, setLinks] = useState<ProfileLink[]>(
    (initial?.links || []).map((l: any) =>
      typeof l === "string"
        ? { label: "", url: l }
        : { label: l.label || "", url: l.url || "", type: l.type },
    ),
  );

  // Re-sync when initial data arrives from fetch (e.g. empty → populated)
  const prevInitialRef = React.useRef(initial);
  React.useEffect(() => {
    if (!initial) return;
    // Only re-sync if initial actually changed meaningfully (compare fullName)
    const prev = prevInitialRef.current;
    if (prev?.fullName === initial.fullName && prev?.email === initial.email)
      return;
    prevInitialRef.current = initial;

    setFullName(initial.fullName || "");
    setHeadline(initial.headline || "");
    setAvatarUrl(initial.avatarUrl ?? null);
    setEmail(initial.email || "");
    setPhone(initial.phone || "");
    setLocation(initial.location || "");
    setSummary(initial.summary || "");
    setLinks(
      (initial.links || []).map((l: any) =>
        typeof l === "string"
          ? { label: "", url: l }
          : { label: l.label || "", url: l.url || "", type: l.type },
      ),
    );
  }, [initial]);

  const didInit = React.useRef(false);
  const [similarWarning, setSimilarWarning] = useState<string | null>(null);

  const normalize = (s: string) => s.trim().toLowerCase().replace(/[.,]/g, "");

  const isSimilar = (a?: string, b?: string) => {
    if (!a || !b) return false;
    const na = normalize(a);
    const nb = normalize(b);
    return na === nb || na.includes(nb) || nb.includes(na);
  };

  useEffect(() => {
    if (
      isSimilar(summary, location) ||
      links.some((l) => isSimilar(l.url, summary))
    ) {
      setSimilarWarning(
        "Profile summary looks similar to location or links — consider making it distinct.",
      );
    } else {
      setSimilarWarning(null);
    }

    if (!didInit.current) {
      didInit.current = true;
      return;
    }

    onChangePersonal?.({
      fullName,
      headline,
      avatarUrl: avatarUrl || undefined,
      email,
      phone,
      location: location || undefined,
      summary,
      links,
    });
  }, [
    fullName,
    headline,
    avatarUrl,
    email,
    phone,
    location,
    summary,
    links,
    onChangePersonal,
  ]);
  return (
    <div className="flex flex-col animate-fade-in-up">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-blue flex items-center justify-center text-white shadow-blue shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                Personal Details
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm mt-1">
                Recruiters prioritize candidates with complete contact
                information.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-bold text-slate-700"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="e.g. John Doe"
                className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-smooth"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="headline"
                className="text-sm font-bold text-slate-700"
              >
                Job Title
              </Label>
              <Input
                id="headline"
                name="headline"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-smooth"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-bold text-slate-700"
              >
                Email Address*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-smooth"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-bold text-slate-700"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-smooth"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-bold text-slate-700"
              >
                Location
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. New York, USA"
                className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-smooth"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="summary"
              className="text-sm font-bold text-slate-700"
            >
              Professional Summary
            </Label>
            <textarea
              id="summary"
              name="summary"
              placeholder="Briefly describe your professional background and key achievements..."
              className="w-full min-h-[120px] rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-blue-500 transition-smooth outline-none"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-slate-700">
                Portfolio & Social Links
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-blue-600 border-blue-100 hover:bg-blue-50 font-bold"
                onClick={(e) => {
                  e.preventDefault();
                  setLinks((prev) => [...prev, { label: "", url: "" }]);
                }}
              >
                <span className="mr-1.5">+</span> Add Link
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {links.map((l, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center gap-2 group animate-fade-in"
                >
                  <Select
                    value={l.type || "other"}
                    onValueChange={(val: LinkType) => {
                      const selectedObj = LINK_TYPES.find(
                        (t) => t.value === val,
                      );
                      setLinks((prev) =>
                        prev.map((p, i) =>
                          i === idx
                            ? {
                                ...p,
                                type: val,
                                label: selectedObj?.label || "",
                              }
                            : p,
                        ),
                      );
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-1/3 h-10 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LINK_TYPES.map((typeObj) => (
                        <SelectItem key={typeObj.value} value={typeObj.value}>
                          {typeObj.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id={`link-url-${idx}`}
                    name={`links[${idx}].url`}
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    className="h-10 w-full sm:w-2/3 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                    value={l.url}
                    onChange={(e) =>
                      setLinks((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, url: e.target.value } : p,
                        ),
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      setLinks((prev) => prev.filter((_, i) => i !== idx));
                    }}
                    className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {similarWarning && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3 mt-4 animate-fade-in">
              <svg
                className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-xs text-amber-700 font-medium">
                {similarWarning}
              </p>
            </div>
          )}
        </form>
      </Card>

      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold text-center sm:text-left leading-relaxed">
          Your data is safe and encrypted. <br className="hidden sm:block" />
          By continuing, you agree to our Terms & Privacy.
        </p>
        <Button
          className="w-full sm:w-auto px-8 h-12 bg-gradient-blue text-white shadow-blue font-bold rounded-2xl hover-lift transition-smooth flex items-center justify-center gap-2 group"
          onClick={() => setStep(2)}
        >
          <span>Next: Experience</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
        </Button>
      </div>
    </div>
  );
}
