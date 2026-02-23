import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { ExperienceItem } from "@/types/resume";

export function FormEmploymentHistory({
  setStep,
  step,
  onChangeEmployment,
  initial,
}: {
  setStep: (value: number) => void;
  step: number;
  onChangeEmployment?: (employment: ExperienceItem[]) => void;
  initial?: ExperienceItem[];
}) {
  const emptyJob = (): ExperienceItem => ({
    id:
      typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()),
    company: "",
    role: "",
    employment_type: "",
    start: "",
    end: "",
    location: undefined,
    highlights: [],
  });

  const [jobs, setJobs] = React.useState<ExperienceItem[]>(() =>
    initial && initial.length > 0 ? initial : [emptyJob()],
  );

  // initialize from initial when it changes
  React.useEffect(() => {
    if (initial && initial.length > 0) setJobs(initial);
  }, [initial]);

  const addJob = () => setJobs((prev) => [...prev, emptyJob()]);
  const removeJob = (index: number) =>
    setJobs((prev) => prev.filter((_, i) => i !== index));

  const updateJobField = (
    index: number,
    field: keyof ExperienceItem,
    value: any,
  ) =>
    setJobs((prev) =>
      prev.map((j, i) => (i === index ? { ...j, [field]: value } : j)),
    );

  const addHighlight = (jobIndex: number) =>
    setJobs((prev) =>
      prev.map((j, i) =>
        i === jobIndex
          ? { ...j, highlights: [...(j.highlights || []), ""] }
          : j,
      ),
    );

  const updateHighlight = (
    jobIndex: number,
    highlightIndex: number,
    value: string,
  ) =>
    setJobs((prev) =>
      prev.map((j, i) =>
        i === jobIndex
          ? {
              ...j,
              highlights: (j.highlights || []).map((h, hi) =>
                hi === highlightIndex ? value : h,
              ),
            }
          : j,
      ),
    );

  const removeHighlight = (jobIndex: number, highlightIndex: number) =>
    setJobs((prev) =>
      prev.map((j, i) =>
        i === jobIndex
          ? {
              ...j,
              highlights: (j.highlights || []).filter(
                (_, hi) => hi !== highlightIndex,
              ),
            }
          : j,
      ),
    );

  const didInit = React.useRef(false);

  React.useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    onChangeEmployment?.(jobs);
  }, [jobs, onChangeEmployment]);

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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                Employment History
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm mt-1">
                Showcase your career highlights and professional growth.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form className="space-y-8">
          <div className="space-y-8">
            {jobs.map((job, jIdx) => (
              <div
                key={job.id || jIdx}
                className="group relative bg-white rounded-3xl p-5 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-smooth animate-fade-in"
              >
                <div className="absolute -top-3 -right-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      removeJob(jIdx);
                    }}
                    className="h-8 w-8 bg-white text-slate-400 hover:text-red-500 shadow-sm border border-slate-100 rounded-full hover:bg-red-50"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`company-${jIdx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Company
                    </Label>
                    <Input
                      id={`company-${jIdx}`}
                      name={`company-${jIdx}`}
                      type="text"
                      placeholder="e.g. Google"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      required
                      value={job.company}
                      onChange={(e) =>
                        updateJobField(jIdx, "company", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`role-${jIdx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Role / Job Title
                    </Label>
                    <Input
                      id={`role-${jIdx}`}
                      name={`role-${jIdx}`}
                      type="text"
                      placeholder="e.g. Product Designer"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      required
                      value={job.role}
                      onChange={(e) =>
                        updateJobField(jIdx, "role", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`start-${jIdx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Start Date
                    </Label>
                    <Input
                      id={`start-${jIdx}`}
                      name={`start-${jIdx}`}
                      type="month"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      value={(job.start || "").substring(0, 7)}
                      onChange={(e) =>
                        updateJobField(jIdx, "start", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`end-${jIdx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      End Date
                    </Label>
                    <Input
                      id={`end-${jIdx}`}
                      name={`end-${jIdx}`}
                      type="month"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      value={(job.end || "").substring(0, 7)}
                      onChange={(e) =>
                        updateJobField(jIdx, "end", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`employment_type-${jIdx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Type
                    </Label>
                    <Input
                      id={`employment_type-${jIdx}`}
                      name={`employment_type-${jIdx}`}
                      type="text"
                      placeholder="Full-time, Contract, etc."
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth text-sm"
                      value={job.employment_type}
                      onChange={(e) =>
                        updateJobField(jIdx, "employment_type", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`location-${jIdx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Location
                    </Label>
                    <Input
                      id={`location-${jIdx}`}
                      name={`location-${jIdx}`}
                      type="text"
                      placeholder="City, Country"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth text-sm"
                      value={job.location || ""}
                      onChange={(e) =>
                        updateJobField(jIdx, "location", e.target.value || null)
                      }
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-sm font-bold text-slate-700">
                      Key Highlights
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg text-blue-600 hover:bg-blue-50 font-bold"
                      onClick={(e) => {
                        e.preventDefault();
                        addHighlight(jIdx);
                      }}
                    >
                      <span className="mr-1.5">+</span> Add Point
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(job.highlights || []).map((h, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 group/h animate-fade-in"
                      >
                        <div className="mt-3.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                        <textarea
                          placeholder="Describe a key achievement or responsibility..."
                          className="flex-1 min-h-[44px] max-h-32 rounded-xl border border-slate-200 p-2.5 text-sm focus:border-blue-500 transition-smooth outline-none"
                          value={h}
                          onChange={(e) =>
                            updateHighlight(jIdx, idx, e.target.value)
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            removeHighlight(jIdx, idx);
                          }}
                          className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl md:opacity-0 md:group-hover/h:opacity-100 transition-opacity"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full py-8 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-smooth font-bold flex flex-col items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                addJob();
              }}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-smooth">
                <span className="text-xl">+</span>
              </div>
              Add Another Experience
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          className="px-6 h-12 text-slate-500 hover:bg-slate-50 font-bold rounded-2xl"
          onClick={() => setStep(1)}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Button>
        <Button
          className="px-8 h-12 bg-gradient-blue text-white shadow-blue font-bold rounded-2xl hover-lift transition-smooth flex items-center justify-center gap-2 group"
          onClick={() => setStep(3)}
        >
          <span>Next: Education</span>
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
