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
import { ExtrasSection } from "@/types/resume";

export function FormExtras({
  setStep,
  step,
  onChangeExtras,
  initial,
  onFinishSave,
  isSaving,
}: {
  setStep: (value: number) => void;
  step: number;
  onChangeExtras?: (extras: ExtrasSection) => void;
  initial?: ExtrasSection;
  onFinishSave?: () => void;
  isSaving?: boolean;
}) {
  const [extras, setExtras] = React.useState<ExtrasSection>(
    initial || {
      certifications: [
        {
          name: "",
          issuer: "",
          date: "",
          url: "",
        },
      ],
      languages: [
        {
          name: "",
          level: "",
        },
      ],
      projects: [
        {
          name: "",
          description: "",
          url: "",
        },
      ],
    },
  );

  React.useEffect(() => {
    if (initial) setExtras(initial);
  }, [initial]);

  const didInit = React.useRef(false);

  React.useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    onChangeExtras?.(extras);
  }, [extras, onChangeExtras]);

  const updateCertification = (index: number, field: string, value: string) => {
    setExtras((prev: ExtrasSection) => {
      const certs = [...(prev.certifications || [])];
      // @ts-ignore - shape matches ExtrasSection
      certs[index] = { ...certs[index], [field]: value };
      return { ...prev, certifications: certs };
    });
  };

  const addCertification = () =>
    setExtras((prev: ExtrasSection) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { name: "", issuer: "", date: "", url: "" },
      ],
    }));

  const removeCertification = (index: number) =>
    setExtras((prev: ExtrasSection) => ({
      ...prev,
      certifications: (prev.certifications || []).filter(
        (_: any, i: number) => i !== index,
      ),
    }));

  const updateLanguage = (index: number, field: string, value: string) => {
    setExtras((prev: ExtrasSection) => {
      const langs = [...(prev.languages || [])];
      // @ts-ignore - shape matches ExtrasSection
      langs[index] = { ...langs[index], [field]: value };
      return { ...prev, languages: langs };
    });
  };

  const addLanguage = () =>
    setExtras((prev: ExtrasSection) => ({
      ...prev,
      languages: [...(prev.languages || []), { name: "", level: "" }],
    }));

  const removeLanguage = (index: number) =>
    setExtras((prev: ExtrasSection) => ({
      ...prev,
      languages: (prev.languages || []).filter(
        (_: any, i: number) => i !== index,
      ),
    }));

  const updateProject = (index: number, field: string, value: string) => {
    setExtras((prev: ExtrasSection) => {
      const projs = [...(prev.projects || [])];
      // @ts-ignore - shape matches ExtrasSection
      projs[index] = { ...projs[index], [field]: value };
      return { ...prev, projects: projs };
    });
  };

  const addProject = () =>
    setExtras((prev: ExtrasSection) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { name: "", description: "", url: "" },
      ],
    }));

  const removeProject = (index: number) =>
    setExtras((prev: ExtrasSection) => ({
      ...prev,
      projects: (prev.projects || []).filter(
        (_: any, i: number) => i !== index,
      ),
    }));

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
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                Additional Sections
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm mt-1">
                Stand out with certifications, languages, and personal projects.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form className="space-y-12">
          {/* Certifications Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Certifications
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-blue-600 border-blue-100 hover:bg-blue-50 font-bold"
                onClick={(e) => {
                  e.preventDefault();
                  addCertification();
                }}
              >
                <span className="mr-1.5">+</span> Add Cert
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(extras.certifications || []).map((c: any, idx: number) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-smooth animate-fade-in space-y-4"
                >
                  <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        removeCertification(idx);
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

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">
                      Certificate Name
                    </Label>
                    <Input
                      placeholder="e.g. AWS Solutions Architect"
                      className="h-10 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      value={c.name}
                      onChange={(e) =>
                        updateCertification(idx, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase">
                      Issuer
                    </Label>
                    <Input
                      placeholder="e.g. Amazon Web Services"
                      className="h-10 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                      value={c.issuer}
                      onChange={(e) =>
                        updateCertification(idx, "issuer", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase">
                        Date
                      </Label>
                      <Input
                        type="month"
                        className="h-10 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                        value={(c.date || "").substring(0, 7)}
                        onChange={(e) =>
                          updateCertification(idx, "date", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase">
                        URL (Optional)
                      </Label>
                      <Input
                        placeholder="Link to cert"
                        className="h-10 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                        value={c.url || ""}
                        onChange={(e) =>
                          updateCertification(idx, "url", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Languages Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Languages</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-blue-600 border-blue-100 hover:bg-blue-50 font-bold"
                onClick={(e) => {
                  e.preventDefault();
                  addLanguage();
                }}
              >
                <span className="mr-1.5">+</span> Add Lang
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(extras.languages || []).map((l: any, idx: number) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-2xl p-4 pt-5 border border-slate-200 shadow-sm hover:shadow-md transition-smooth animate-fade-in"
                >
                  <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        removeLanguage(idx);
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
                  <div className="space-y-3">
                    <Input
                      placeholder="e.g. English"
                      className="h-9 rounded-lg border-slate-100 focus:border-blue-500 transition-smooth text-sm font-bold"
                      value={l.name}
                      onChange={(e) =>
                        updateLanguage(idx, "name", e.target.value)
                      }
                    />
                    <div className="flex flex-wrap gap-1">
                      {["Basic", "Fluent", "Native"].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => updateLanguage(idx, "level", lvl)}
                          className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tight transition-smooth border ${
                            l.level === lvl
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                              : "bg-slate-50 border-slate-50 text-slate-400 hover:bg-white hover:border-slate-200"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Projects</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-blue-600 border-blue-100 hover:bg-blue-50 font-bold"
                onClick={(e) => {
                  e.preventDefault();
                  addProject();
                }}
              >
                <span className="mr-1.5">+</span> Add Project
              </Button>
            </div>

            <div className="space-y-6">
              {(extras.projects || []).map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-smooth animate-fade-in"
                >
                  <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        removeProject(idx);
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Project Name
                      </Label>
                      <Input
                        placeholder="e.g. AI Portfolio Generator"
                        className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth font-bold"
                        value={p.name}
                        onChange={(e) =>
                          updateProject(idx, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        URL / Link
                      </Label>
                      <Input
                        placeholder="e.g. github.com/username/project"
                        className="h-11 rounded-xl border-slate-200 focus:border-blue-500 transition-smooth"
                        value={p.url || ""}
                        onChange={(e) =>
                          updateProject(idx, "url", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Description
                      </Label>
                      <textarea
                        placeholder="Describe the project goal, technologies used, and your impact..."
                        className="w-full min-h-[100px] max-h-40 rounded-xl border border-slate-200 p-4 text-sm focus:border-blue-500 transition-smooth outline-none"
                        value={p.description || ""}
                        onChange={(e) =>
                          updateProject(idx, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </form>
      </Card>

      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Button
          variant="ghost"
          className="w-full sm:w-auto px-6 h-12 text-slate-500 hover:bg-slate-50 font-bold rounded-2xl flex items-center justify-center gap-2"
          onClick={() => setStep(4)}
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Button>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            className={`w-full sm:w-auto px-10 h-14 bg-gradient-blue text-white shadow-blue font-bold rounded-2xl hover-lift transition-smooth flex items-center justify-center gap-3 group text-lg ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={isSaving}
            onClick={(e) => {
              e.preventDefault();
              onFinishSave?.();
            }}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
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
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>Finish &amp; Save Resume</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
