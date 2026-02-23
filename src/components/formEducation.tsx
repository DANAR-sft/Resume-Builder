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

import { EducationItem } from "@/types/resume";

export function FormEducation({
  setStep,
  step,
  onChangeEducation,
  initial,
}: {
  setStep: (value: number) => void;
  step: number;
  onChangeEducation?: (education: EducationItem[]) => void;
  initial?: EducationItem[];
}) {
  const emptyEdu = (): EducationItem => ({
    id:
      typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()),
    college: "",
    degree: "",
    field: "",
    start: "",
    end: "",
    gpa: undefined,
  });

  const [edus, setEdus] = React.useState<EducationItem[]>(() =>
    initial && initial.length > 0 ? initial : [emptyEdu()],
  );

  React.useEffect(() => {
    if (initial && initial.length > 0) setEdus(initial);
  }, [initial]);

  const addEdu = () => setEdus((prev) => [...prev, emptyEdu()]);
  const removeEdu = (index: number) =>
    setEdus((prev) => prev.filter((_, i) => i !== index));

  const updateEduField = (
    index: number,
    field: keyof EducationItem,
    value: any,
  ) =>
    setEdus((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)),
    );

  const didInit = React.useRef(false);

  React.useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    onChangeEducation?.(edus);
  }, [edus, onChangeEducation]);

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
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                Education
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm mt-1">
                List your academic achievements and qualifications.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form className="space-y-8">
          <div className="space-y-8">
            {edus.map((edu, idx) => (
              <div
                key={edu.id || idx}
                className="group relative bg-white rounded-3xl p-5 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-smooth animate-fade-in"
              >
                <div className="absolute -top-3 -right-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      removeEdu(idx);
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
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor={`college-${idx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      College / Institution
                    </Label>
                    <Input
                      id={`college-${idx}`}
                      name={`college-${idx}`}
                      type="text"
                      placeholder="e.g. Stanford University"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      required
                      value={edu.college}
                      onChange={(e) =>
                        updateEduField(idx, "college", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`degree-${idx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Degree
                    </Label>
                    <Input
                      id={`degree-${idx}`}
                      name={`degree-${idx}`}
                      type="text"
                      placeholder="e.g. Bachelor of Science"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEduField(idx, "degree", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`field-${idx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Field of Study
                    </Label>
                    <Input
                      id={`field-${idx}`}
                      name={`field-${idx}`}
                      type="text"
                      placeholder="e.g. Computer Science"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      value={edu.field}
                      onChange={(e) =>
                        updateEduField(idx, "field", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`start-${idx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Start Date
                    </Label>
                    <Input
                      id={`start-${idx}`}
                      name={`start-${idx}`}
                      type="month"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      value={(edu.start || "").substring(0, 7)}
                      onChange={(e) =>
                        updateEduField(idx, "start", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`end-${idx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      End Date
                    </Label>
                    <Input
                      id={`end-${idx}`}
                      name={`end-${idx}`}
                      type="month"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      value={(edu.end || "").substring(0, 7)}
                      onChange={(e) =>
                        updateEduField(idx, "end", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`gpa-${idx}`}
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      GPA / Grade
                    </Label>
                    <Input
                      id={`gpa-${idx}`}
                      name={`gpa-${idx}`}
                      type="text"
                      placeholder="e.g. 3.8 / 4.0"
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      value={edu.gpa || ""}
                      onChange={(e) =>
                        updateEduField(idx, "gpa", e.target.value || null)
                      }
                    />
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
                addEdu();
              }}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-smooth">
                <span className="text-xl">+</span>
              </div>
              Add Another Education
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          className="px-6 h-12 text-slate-500 hover:bg-slate-50 font-bold rounded-2xl"
          onClick={() => setStep(2)}
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
          onClick={() => setStep(4)}
        >
          <span>Next: Skills</span>
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
