"use client";

import { ResumeData, ThemeConfig } from "@/types/resume";

type AtsTemplateProps = {
  data: ResumeData;
  styles?: ThemeConfig;
};

function isNonEmpty(value: string | null | undefined): value is string {
  return Boolean(value && value.trim().length > 0);
}

export function AtsTemplate({ data, styles }: AtsTemplateProps) {
  const profile = data.profile || ({} as any);
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const extras = data.extras;

  const contactLine = [profile.location, profile.email, profile.phone]
    .filter(isNonEmpty)
    .join("  •  ");

  const links = (profile.links || [])
    .map((l: any) => (typeof l === "string" ? l : l.url))
    .filter(isNonEmpty);

  return (
    <article
      className="w-[210mm] min-h-[297mm] mx-auto bg-white text-black font-sans leading-snug border border-gray-200 shadow-sm print:border-0 print:shadow-none"
      style={{
        fontFamily: styles?.fontFamily || undefined,
        fontSize: styles?.fontSize ? `${styles.fontSize}` : undefined,
      }}
    >
      <div style={{ padding: styles?.pagePadding || "10mm" }}>
        <header className="text-center">
          <h1 className="text-[24px] font-semibold tracking-tight">
            {profile.fullName || ""}
          </h1>
          {isNonEmpty(profile.headline) && (
            <div className="mt-1 text-[12px] text-black/80">
              {profile.headline}
            </div>
          )}
          {isNonEmpty(contactLine) && (
            <div className="mt-2 text-[11px] text-black/70">{contactLine}</div>
          )}
          {links.length > 0 && (
            <div className="mt-1 text-[11px] text-black/70">
              {links.join("  •  ")}
            </div>
          )}
        </header>

        <div className="mt-5 h-px bg-black/20" />

        {isNonEmpty(profile.summary) && (
          <section className="mt-5 grid grid-cols-[120px_1fr] gap-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider">
              Summary
            </h2>
            <p className="whitespace-pre-line text-black/85">
              {profile.summary}
            </p>
          </section>
        )}

        <section aria-labelledby="experience" className="mt-5">
          <div className="grid grid-cols-[120px_1fr] gap-5">
            <h2
              id="experience"
              className="text-[11px] font-semibold uppercase tracking-wider"
            >
              Experience
            </h2>
            <div className="space-y-4">
              {experience && experience.length > 0 ? (
                experience.map((job, index) => (
                  <div
                    key={job.id || `exp-${index}`}
                    className="grid grid-cols-[1fr_auto] gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <div className="font-semibold">{job.role}</div>
                        <div className="text-black/75">{job.company}</div>
                        {isNonEmpty(job.employment_type) && (
                          <div className="text-[10px] text-black/60">
                            ({job.employment_type})
                          </div>
                        )}
                      </div>
                      {(job.highlights || []).length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {(job.highlights || []).map((h, i) => (
                            <li
                              key={`high-${i}`}
                              className="grid grid-cols-[12px_1fr] gap-2"
                            >
                              <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-black/50" />
                              <span className="text-black/85">{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-right text-[10px] text-black/65 whitespace-nowrap">
                      <div>
                        {job.start} — {job.end}
                      </div>
                      {isNonEmpty(job.location) && <div>{job.location}</div>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-black/65">No experience listed.</p>
              )}
            </div>
          </div>
        </section>

        <div className="my-5 h-px bg-black/10" />

        <section aria-labelledby="education">
          <div className="grid grid-cols-[120px_1fr] gap-5">
            <h2
              id="education"
              className="text-[11px] font-semibold uppercase tracking-wider"
            >
              Education
            </h2>
            <div className="space-y-3">
              {education && education.length > 0 ? (
                education.map((edu, index) => (
                  <div
                    key={edu.id || `edu-${index}`}
                    className="grid grid-cols-[1fr_auto] gap-4"
                  >
                    <div>
                      <div className="font-semibold">{edu.college}</div>
                      <div className="text-black/80">
                        {edu.degree}
                        {isNonEmpty(edu.field) ? `, ${edu.field}` : ""}
                        {isNonEmpty(edu.gpa) ? ` — GPA ${edu.gpa}` : ""}
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-black/65 whitespace-nowrap">
                      {edu.start} — {edu.end}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-black/65">No education listed.</p>
              )}
            </div>
          </div>
        </section>

        <div className="my-5 h-px bg-black/10" />

        <section aria-labelledby="skills">
          <div className="grid grid-cols-[120px_1fr] gap-5">
            <h2
              id="skills"
              className="text-[11px] font-semibold uppercase tracking-wider"
            >
              Skills
            </h2>
            {skills && skills.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {skills.map((s, i) => (
                  <div
                    key={`skill-${i}`}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <div className="font-medium text-black/85">{s}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black/65">No skills listed.</p>
            )}
          </div>
        </section>

        {((extras?.projects?.length ?? 0) > 0 ||
          (extras?.certifications?.length ?? 0) > 0 ||
          (extras?.languages?.length ?? 0) > 0) && (
          <>
            <div className="my-5 h-px bg-black/10" />
            <section aria-labelledby="extras">
              <div className="grid grid-cols-[120px_1fr] gap-5">
                <h2
                  id="extras"
                  className="text-[11px] font-semibold uppercase tracking-wider"
                >
                  Additional
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {(extras?.projects?.length ?? 0) > 0 && (
                    <div>
                      <div className="font-semibold">Projects</div>
                      <ul className="mt-2 space-y-2">
                        {(extras?.projects ?? []).map((p, i) => (
                          <li key={`project-${i}`}>
                            <div className="font-medium text-black/85">
                              {p.name}
                            </div>
                            {isNonEmpty(p.description) && (
                              <div className="mt-1 text-black/75">
                                {p.description}
                              </div>
                            )}
                            {isNonEmpty(p.url) && (
                              <div className="mt-1 text-[10px] text-black/65">
                                {p.url}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(extras?.certifications?.length ?? 0) > 0 && (
                    <div>
                      <div className="font-semibold">Certifications</div>
                      <ul className="mt-2 space-y-2">
                        {(extras?.certifications ?? []).map((c, i) => (
                          <li key={`cert-${i}`}>
                            <div className="font-medium text-black/85">
                              {c.name}
                            </div>
                            <div className="mt-1 text-[10px] text-black/65">
                              {c.issuer}
                              {isNonEmpty(c.date) ? ` • ${c.date}` : ""}
                              {isNonEmpty(c.url) ? ` • ${c.url}` : ""}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(extras?.languages?.length ?? 0) > 0 && (
                    <div>
                      <div className="font-semibold">Languages</div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-black/85">
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
              </div>
            </section>
          </>
        )}
      </div>
    </article>
  );
}

export default AtsTemplate;
