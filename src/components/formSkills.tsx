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
// Local type for skill items with id and level (UI helper)
type SkillItem = { id: string; skillName: string };

export function FormSkills({
  setStep,
  step,
  onChangeSkills,
  initial,
}: {
  setStep: (value: number) => void;
  step: number;
  onChangeSkills?: (skills: { id: string; skillName: string }[]) => void;
  initial?: any[];
}) {
  const [skills, setSkills] = React.useState<string[]>(() => {
    if (!initial || initial.length === 0) return [""];
    return initial.map((s) => (typeof s === "string" ? s : s.skillName || ""));
  });

  const didInitEmit = React.useRef(false);

  // Re-sync when initial data arrives from fetch ONLY if skills are empty or hasn't been touched yet
  React.useEffect(() => {
    if (!initial || initial.length === 0) return;
    const initialStrings = initial.map((s: any) =>
      typeof s === "string" ? s : s.skillName || "",
    );

    if (JSON.stringify(skills) !== JSON.stringify(initialStrings)) {
      setSkills(initialStrings);
    }
  }, [initial]);

  React.useEffect(() => {
    if (!didInitEmit.current) {
      didInitEmit.current = true;
      return;
    }
    // Mapping back to what the parent expects
    onChangeSkills?.(skills.map((s, i) => ({ id: String(i), skillName: s })));
  }, [skills, onChangeSkills]);

  const addSkill = () => setSkills((prev) => [...prev, ""]);

  const updateSkillName = (index: number, value: string) => {
    setSkills((prev) => {
      const newSkills = [...prev];
      newSkills[index] = value;
      return newSkills;
    });
  };

  const removeSkill = (index: number) =>
    setSkills((prev) => prev.filter((_, i) => i !== index));

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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                Skills & Expertise
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm mt-1">
                Highlight your core strengths and technical proficiency.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {skills.map((skillName, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-smooth animate-fade-in flex flex-col gap-4"
              >
                <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      removeSkill(idx);
                    }}
                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
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

                <div className="space-y-1.5">
                  <Label
                    htmlFor={`skillName-${idx}`}
                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Skill Name
                  </Label>
                  <Input
                    id={`skillName-${idx}`}
                    name={`skills[${idx}].skillName`}
                    type="text"
                    placeholder="e.g. React.js"
                    className="h-10 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                    value={skillName}
                    onChange={(e) => updateSkillName(idx, e.target.value)}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="py-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-smooth font-bold flex flex-col items-center gap-2 group h-full justify-center"
              onClick={(e) => {
                e.preventDefault();
                addSkill();
              }}
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-smooth text-lg">
                +
              </div>
              <span className="text-xs">Add Skill</span>
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          className="px-6 h-12 text-slate-500 hover:bg-slate-50 font-bold rounded-2xl"
          onClick={() => setStep(3)}
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
          onClick={() => setStep(5)}
        >
          <span>Next: Extra Details</span>
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
