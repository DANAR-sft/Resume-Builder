"use client";

import { ResumeData, ThemeConfig } from "@/types/resume";

type ExecutiveClassicTemplateProps = {
  data: ResumeData;
  styles?: ThemeConfig;
};

function isNonEmpty(value: string | null | undefined): value is string {
  return Boolean(value && value.trim().length > 0);
}

function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "";
  if (dateString.toLowerCase() === "present") return "Present";
  const parts = dateString.split("-");
  const year = parts[0];
  const month = parts[1];
  if (!year || !month) return dateString;

  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ExecutiveClassicTemplate({
  data,
  styles,
}: ExecutiveClassicTemplateProps) {
  const profile = data.profile || ({} as any);
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const extras = data.extras;

  const headerLine = [profile.location, profile.email, profile.phone]
    .filter(isNonEmpty)
    .join("  •  ");

  return (
    <article
      className="w-[210mm] min-h-[297mm] mx-auto bg-white text-black font-serif text-[11px] leading-snug border border-black/20 shadow-sm print:border-0 print:shadow-none"
      style={{
        fontFamily: styles?.fontFamily || undefined,
        fontSize: styles?.fontSize ? `${styles.fontSize}` : undefined,
      }}
    >
      <div style={{ padding: styles?.pagePadding || "10mm" }}>
        <header className="text-center">
          <h1 className="text-[22px] font-bold tracking-tight">
            {profile.fullName || ""}
          </h1>
          {isNonEmpty(profile.headline) && (
            <p className="mt-1 text-[12px] font-medium">{profile.headline}</p>
          )}
          {isNonEmpty(headerLine) && (
            <p className="mt-2 text-[11px]">{headerLine}</p>
          )}
          {profile.links && profile.links.length > 0 && (
            <p className="mt-1 text-[11px]">
              {profile.links
                .map((l: any) => (typeof l === "string" ? l : l.url))
                .filter(isNonEmpty)
                .join("  •  ")}
            </p>
          )}
        </header>

        <div className="mt-6 h-px bg-black/30" />

        {isNonEmpty(profile.summary) && (
          <section className="mt-5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em]">
              Summary
            </h2>
            <p className="mt-2 whitespace-pre-line">{profile.summary}</p>
          </section>
        )}

        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.16em]">
            Experience
          </h2>
          <div className="mt-2 space-y-4">
            {experience && experience.length > 0 ? (
              experience.map((job, index) => (
                <div
                  key={job.id || `exp-${index}`}
                  className="grid grid-cols-[105px_1fr] gap-4"
                >
                  <div className="text-[10px]">
                    <div>
                      {formatDate(job.start)} – {formatDate(job.end)}
                    </div>
                    {isNonEmpty(job.location) && (
                      <div className="mt-1">{job.location}</div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <div className="font-bold">{job.role}</div>
                      <div className="text-black/80">{job.company}</div>
                      {isNonEmpty(job.employment_type) && (
                        <div className="text-[10px] text-black/70">
                          ({job.employment_type})
                        </div>
                      )}
                    </div>
                    {(job.highlights || []).length > 0 && (
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {(job.highlights || []).map((h, i) => (
                          <li key={`high-${i}`}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-1 text-black/70">No experience listed.</p>
            )}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.16em]">
            Education
          </h2>
          <div className="mt-2 space-y-3">
            {education && education.length > 0 ? (
              education.map((edu, index) => (
                <div
                  key={edu.id || `edu-${index}`}
                  className="grid grid-cols-[105px_1fr] gap-4"
                >
                  <div className="text-[10px]">
                    {formatDate(edu.start)} – {formatDate(edu.end)}
                  </div>
                  <div>
                    <div className="font-bold">
                      {edu.degree}
                      {isNonEmpty(edu.field) ? `, ${edu.field}` : ""}
                    </div>
                    <div className="text-black/80">{edu.college}</div>
                    {isNonEmpty(edu.gpa) && (
                      <div className="mt-1 text-[10px]">GPA: {edu.gpa}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black/70">No education listed.</p>
            )}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.16em]">
            Skills
          </h2>
          {skills && skills.length > 0 ? (
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
              {skills.map((s, i) => (
                <div
                  key={`skill-${i}`}
                  className="flex items-baseline justify-between"
                >
                  <div className="font-medium">{s}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-black/70">No skills listed.</p>
          )}
        </section>

        {((extras?.certifications?.length ?? 0) > 0 ||
          (extras?.languages?.length ?? 0) > 0 ||
          (extras?.projects?.length ?? 0) > 0) && (
          <section className="mt-5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em]">
              Additional
            </h2>

            <div className="mt-2 grid grid-cols-1 gap-4">
              {(extras?.certifications?.length ?? 0) > 0 && (
                <div>
                  <div className="font-bold">Certifications</div>
                  <ul className="mt-1 space-y-1">
                    {(extras?.certifications ?? []).map((c, i) => (
                      <li key={`cert-${i}`}>
                        <span className="font-medium">{c.name}</span>
                        {isNonEmpty(c.issuer) ? ` — ${c.issuer}` : ""}
                        {isNonEmpty(c.date) ? ` (${c.date})` : ""}
                        {isNonEmpty(c.url) ? ` — ${c.url}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(extras?.projects?.length ?? 0) > 0 && (
                <div>
                  <div className="font-bold">Projects</div>
                  <ul className="mt-1 space-y-1">
                    {(extras?.projects ?? []).map((p, i) => (
                      <li key={`project-${i}`}>
                        <span className="font-medium">{p.name}</span>
                        {isNonEmpty(p.url) ? ` — ${p.url}` : ""}
                        {isNonEmpty(p.description) ? (
                          <div className="mt-1 text-black/80">
                            {p.description}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(extras?.languages?.length ?? 0) > 0 && (
                <div>
                  <div className="font-bold">Languages</div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {(extras?.languages ?? []).map((l, i) => (
                      <div key={`lang-${i}`}>
                        <span className="font-medium">{l.name}</span>
                        {isNonEmpty(l.level) ? ` (${l.level})` : ""}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

export default ExecutiveClassicTemplate;
