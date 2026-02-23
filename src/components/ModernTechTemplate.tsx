"use client";

import { ResumeData, ThemeConfig } from "@/types/resume";

type ModernTechTemplateProps = {
  data: ResumeData;
  styles?: ThemeConfig;
};

function isNonEmpty(value: string | null | undefined): value is string {
  return Boolean(value && value.trim().length > 0);
}

function asUrl(value: string): string {
  const v = value.trim();
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.includes("@")) return `mailto:${v}`;
  return `https://${v}`;
}

export function ModernTechTemplate({ data, styles }: ModernTechTemplateProps) {
  const profile = data.profile || ({} as any);
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const extras = data.extras;

  const links = (profile.links || [])
    .map((l: any) => (typeof l === "string" ? l : l.url))
    .filter(isNonEmpty);
  const skillList = skills.filter((s: string) => isNonEmpty(s));

  return (
    <article
      className="w-[210mm] min-h-[297mm] mx-auto bg-white text-slate-950 font-sans text-[11px] leading-snug border border-slate-200 shadow-sm print:border-0 print:shadow-none"
      style={{
        fontFamily: styles?.fontFamily || undefined,
        fontSize: styles?.fontSize ? `${styles.fontSize}` : undefined,
      }}
    >
      <div style={{ padding: styles?.pagePadding || "8mm" }}>
        {/* Header */}
        <header className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-[22px] font-semibold tracking-tight">
              {profile.fullName || ""}
            </h1>
            {isNonEmpty(profile.headline) && (
              <p className="mt-1 text-[12px] text-slate-700">
                {profile.headline}
              </p>
            )}
            {isNonEmpty(profile.summary) && (
              <p className="mt-3 text-slate-800 whitespace-pre-line">
                {profile.summary}
              </p>
            )}
          </div>

          <div className="shrink-0 text-right text-[11px] text-slate-700">
            {isNonEmpty(profile.location) && <div>{profile.location}</div>}
            {isNonEmpty(profile.email) && (
              <a
                className="underline underline-offset-2"
                style={{
                  color: "var(--resume-primary)",
                  textDecorationColor:
                    "color-mix(in oklab, var(--resume-primary) 35%, transparent)",
                }}
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
            )}
            {isNonEmpty(profile.phone) && <div>{profile.phone}</div>}
            {links.length > 0 && (
              <div className="mt-2 space-y-1">
                {links.slice(0, 4).map((l: string, i: number) => (
                  <a
                    key={`${l}-${i}`}
                    className="block underline underline-offset-2"
                    style={{
                      color: "var(--resume-primary)",
                      textDecorationColor:
                        "color-mix(in oklab, var(--resume-primary) 35%, transparent)",
                    }}
                    href={asUrl(l)}
                  >
                    {l}
                  </a>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="mt-5 h-px bg-slate-200" />

        {/* Body */}
        <div className="mt-5 grid grid-cols-[7fr_3fr] gap-7">
          {/* Main (70%) */}
          <main className="min-w-0">
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                Experience
              </h2>
              <div className="mt-3 space-y-5">
                {experience && experience.length > 0 ? (
                  experience.map((job, index) => (
                    <div
                      key={job.id || `exp-${index}`}
                      className="grid grid-cols-[1fr_auto] gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <div className="font-semibold text-slate-900">
                            {job.role}
                          </div>
                          <div className="text-slate-700">@ {job.company}</div>
                          {isNonEmpty(job.employment_type) && (
                            <div className="text-[10px] text-slate-500">
                              {job.employment_type}
                            </div>
                          )}
                        </div>
                        {(job.highlights || []).length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {(job.highlights || []).map((h, i) => (
                              <li key={`high-${i}`} className="flex gap-2">
                                <span className="mt-[4px] h-[3px] w-[3px] rounded-full bg-slate-500" />
                                <span className="min-w-0 text-slate-800">
                                  {h}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="text-right text-[10px] text-slate-600">
                        <div>
                          {job.start} – {job.end}
                        </div>
                        {isNonEmpty(job.location) && <div>{job.location}</div>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="mt-2 text-slate-600">No experience listed.</p>
                )}
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                Education
              </h2>
              <div className="mt-3 space-y-3">
                {education && education.length > 0 ? (
                  education.map((edu, index) => (
                    <div
                      key={edu.id || `edu-${index}`}
                      className="grid grid-cols-[1fr_auto] gap-3"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">
                          {edu.college}
                        </div>
                        <div className="text-slate-700">
                          {edu.degree}
                          {isNonEmpty(edu.field) ? `, ${edu.field}` : ""}
                          {isNonEmpty(edu.gpa) ? ` — GPA ${edu.gpa}` : ""}
                        </div>
                      </div>
                      <div className="text-right text-[10px] text-slate-600">
                        {edu.start} – {edu.end}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="mt-2 text-slate-600">No education listed.</p>
                )}
              </div>
            </section>

            {(extras?.projects?.length ?? 0) > 0 && (
              <section className="mt-6">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  Projects
                </h2>
                <div className="mt-3 space-y-3">
                  {(extras?.projects ?? []).map((p, i) => (
                    <div key={`${p.name}-${i}`}>
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <div className="font-semibold text-slate-900">
                          {p.name}
                        </div>
                        {isNonEmpty(p.url) && (
                          <a
                            className="underline underline-offset-2"
                            style={{
                              color: "var(--resume-primary)",
                              textDecorationColor:
                                "color-mix(in oklab, var(--resume-primary) 35%, transparent)",
                            }}
                            href={asUrl(p.url)}
                          >
                            {p.url}
                          </a>
                        )}
                      </div>
                      {isNonEmpty(p.description) && (
                        <p className="mt-1 text-slate-800">{p.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar (30%) */}
          <aside className="space-y-5">
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                Skills
              </h2>
              {skillList.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skillList.map((s, i) => (
                    <span
                      key={`skill-${i}`}
                      className="inline-flex items-center rounded-md border bg-slate-50 px-2 py-1 text-[10px] text-slate-800"
                      style={{
                        borderColor:
                          "color-mix(in oklab, var(--resume-primary) 25%, #e2e8f0)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-slate-600">No skills listed.</p>
              )}
            </section>

            {(extras?.certifications?.length ?? 0) > 0 && (
              <section>
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  Certifications
                </h2>
                <ul className="mt-3 space-y-2 text-slate-800">
                  {(extras?.certifications ?? []).map((c, i) => (
                    <li key={`${c.name}-${i}`}>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-[10px] text-slate-600">
                        {c.issuer}
                        {isNonEmpty(c.date) ? ` • ${c.date}` : ""}
                      </div>
                      {isNonEmpty(c.url) && (
                        <a
                          className="text-[10px] underline underline-offset-2"
                          style={{
                            color: "var(--resume-primary)",
                            textDecorationColor:
                              "color-mix(in oklab, var(--resume-primary) 35%, transparent)",
                          }}
                          href={asUrl(c.url)}
                        >
                          {c.url}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(extras?.languages?.length ?? 0) > 0 && (
              <section>
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  Languages
                </h2>
                <div className="mt-3 space-y-1 text-slate-800">
                  {(extras?.languages ?? []).map((l, i) => (
                    <div
                      key={`${l.name}-${i}`}
                      className="flex justify-between gap-3"
                    >
                      <span>{l.name}</span>
                      <span className="text-[10px] text-slate-600">
                        {l.level || ""}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}

export default ModernTechTemplate;
