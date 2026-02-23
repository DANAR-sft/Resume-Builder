import jsPDF from "jspdf";
import { Resume } from "@/types/resume";

function isNonEmpty(value: string | null | undefined): value is string {
  return Boolean(value && value.trim().length > 0);
}

// Convert HTML hex to RGB for jsPDF
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Common configuration for PDF generation
 */
const PDF_CONFIG = {
  orientation: "portrait" as const,
  unit: "mm" as const,
  format: "a4" as const,
  compress: true,
};

// Helper interface for type safety since we are dealing with nested structures
interface ProfileData {
  fullName?: string;
  headline?: string;
  location?: string;
  email?: string;
  phone?: string;
  summary?: string;
  links?: any[];
}

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 15; // standard 15mm margin
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Helper to check page break and add a new page
function checkPageBreak(
  doc: jsPDF,
  currentY: number,
  elementHeight: number,
  lastElementMargin: number = 0,
) {
  if (currentY + elementHeight + lastElementMargin > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return currentY;
}

// Helper to wrap text
function writeWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

/**
 * Generates an ATS-style PDF natively using jsPDF API.
 */
function buildAtsPdf(doc: jsPDF, resume: Resume) {
  const data = resume.data ?? ({} as any);
  const profile = (data.profile || {}) as ProfileData;
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const extras = data.extras;

  let y = MARGIN;

  // Header: Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  const name = profile.fullName || "Untitled Resume";
  doc.text(name, PAGE_WIDTH / 2, y, { align: "center" });
  y += 8;

  // Header: Headline
  if (isNonEmpty(profile.headline)) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(profile.headline, PAGE_WIDTH / 2, y, { align: "center" });
    y += 6;
  }

  // Header: Contact Info
  const contactLine = [profile.location, profile.email, profile.phone]
    .filter(isNonEmpty)
    .join("  •  ");

  if (isNonEmpty(contactLine)) {
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(contactLine, PAGE_WIDTH / 2, y, { align: "center" });
    y += 5;
  }

  // Header: Links
  const links = (profile.links || [])
    .map((l: any) => (typeof l === "string" ? l : l.url))
    .filter(isNonEmpty);

  if (links.length > 0) {
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(links.join("  •  "), PAGE_WIDTH / 2, y, { align: "center" });
    y += 5;
  }

  y += 5;
  // Separator Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  const leftColWidth = 32; // ~120px in mm
  const rightColX = MARGIN + leftColWidth + 5;
  const rightColWidth = PAGE_WIDTH - MARGIN - rightColX;

  // Summary
  if (isNonEmpty(profile.summary)) {
    y = checkPageBreak(doc, y, 20); // Estimate summary height
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("SUMMARY", MARGIN, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    // Align with the rest of the text
    y = writeWrappedText(doc, profile.summary, rightColX, y, rightColWidth, 5);
    y += 5;
  }

  // Experience
  if (experience && experience.length > 0) {
    y = checkPageBreak(doc, y, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("EXPERIENCE", MARGIN, y);

    let firstExp = true;
    for (const job of experience) {
      if (!firstExp) y += 5;
      firstExp = false;

      y = checkPageBreak(doc, y, 15);

      // We need to keep track of the highest Y reached in this row
      // Left side: Company & Role
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      let titleLine = job.role || "";
      if (isNonEmpty(job.company)) {
        doc.text(titleLine, rightColX, y);
        let titleWidth = doc.getTextWidth(titleLine);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(` ${job.company}`, rightColX + titleWidth, y);
      } else {
        doc.text(titleLine, rightColX, y);
      }

      let leftY = y + 5;
      if (isNonEmpty(job.employment_type)) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(`(${job.employment_type})`, rightColX, leftY);
        leftY += 5;
      }

      // Right side: Dates & Location
      const dates = `${job.start || ""} — ${job.end || ""}`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(dates, PAGE_WIDTH - MARGIN, y, { align: "right" });

      let rightY = y + 5;
      if (isNonEmpty(job.location)) {
        doc.text(job.location, PAGE_WIDTH - MARGIN, rightY, { align: "right" });
        rightY += 5;
      }

      y = Math.max(leftY, rightY) + 2;

      // Highlights
      if (job.highlights && job.highlights.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        for (const h of job.highlights) {
          y = checkPageBreak(doc, y, 5);
          doc.text("•", rightColX, y);
          y = writeWrappedText(doc, h, rightColX + 4, y, rightColWidth - 4, 5);
        }
      }
    }
    y += 5;
  }

  // Line separator
  y = checkPageBreak(doc, y, 10);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  // Education
  if (education && education.length > 0) {
    y = checkPageBreak(doc, y, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("EDUCATION", MARGIN, y);

    let firstEdu = true;
    for (const edu of education) {
      if (!firstEdu) y += 5;
      firstEdu = false;

      y = checkPageBreak(doc, y, 10);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(edu.college || "", rightColX, y);

      const dates = `${edu.start || ""} — ${edu.end || ""}`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(dates, PAGE_WIDTH - MARGIN, y, { align: "right" });
      y += 5;

      let degLine = edu.degree || "";
      let degDetails = "";
      if (isNonEmpty(edu.field)) degDetails += `, ${edu.field}`;
      if (isNonEmpty(edu.gpa)) degDetails += ` — GPA ${edu.gpa}`;

      if (degLine || degDetails) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(degLine + degDetails, rightColX, y);
        y += 5;
      }
    }
    y += 5;
  }

  // Line separator
  y = checkPageBreak(doc, y, 10);
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  // Skills
  if (skills && skills.length > 0) {
    y = checkPageBreak(doc, y, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("SKILLS", MARGIN, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);

    // Split skills into a 2 column grid
    const midPoint = Math.ceil(skills.length / 2);
    const col1 = skills.slice(0, midPoint);
    const col2 = skills.slice(midPoint);

    let skillsY = y;
    for (let i = 0; i < Math.max(col1.length, col2.length); i++) {
      skillsY = checkPageBreak(doc, skillsY, 5);
      if (col1[i]) doc.text(col1[i], rightColX, skillsY);
      // Using approximately half the right column width for the second column
      if (col2[i])
        doc.text(col2[i], rightColX + rightColWidth / 2 + 5, skillsY);
      skillsY += 6;
    }
    y = skillsY + 2;
  }

  // Extras
  const hasProjects = extras?.projects && extras.projects.length > 0;
  const hasCerts = extras?.certifications && extras.certifications.length > 0;
  const hasLangs = extras?.languages && extras.languages.length > 0;

  if (hasProjects || hasCerts || hasLangs) {
    y = checkPageBreak(doc, y, 10);
    doc.setDrawColor(220, 220, 220);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("ADDITIONAL", MARGIN, y);

    let firstSection = true;

    if (hasProjects) {
      if (!firstSection) y += 5;
      firstSection = false;

      doc.setFont("helvetica", "bold");
      y = checkPageBreak(doc, y, 5);
      doc.text("Projects", rightColX, y);
      y += 5;

      for (const p of extras!.projects!) {
        y = checkPageBreak(doc, y, 10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(10);
        doc.text(p.name || "", rightColX, y);
        y += 5;

        if (isNonEmpty(p.description)) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          y = writeWrappedText(
            doc,
            p.description,
            rightColX,
            y,
            rightColWidth,
            5,
          );
        }
        if (isNonEmpty(p.url)) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(p.url, rightColX, y);
          y += 5;
        }
      }
    }

    if (hasCerts) {
      if (!firstSection) y += 5;
      firstSection = false;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      y = checkPageBreak(doc, y, 5);
      doc.text("Certifications", rightColX, y);
      y += 5;

      for (const c of extras!.certifications!) {
        y = checkPageBreak(doc, y, 10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text(c.name || "", rightColX, y);
        y += 5;

        let cLine = c.issuer || "";
        if (isNonEmpty(c.date)) cLine += ` • ${c.date}`;
        if (isNonEmpty(c.url)) cLine += ` • ${c.url}`;

        if (cLine) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(cLine, rightColX, y);
          y += 5;
        }
      }
    }

    if (hasLangs) {
      if (!firstSection) y += 5;
      firstSection = false;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      y = checkPageBreak(doc, y, 5);
      doc.text("Languages", rightColX, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);

      const langs = extras!
        .languages!.map((l) => {
          let str = l.name;
          if (isNonEmpty(l.level)) str += ` (${l.level})`;
          return str;
        })
        .join("   ");

      if (langs) {
        y = writeWrappedText(doc, langs, rightColX, y, rightColWidth, 5);
      }
    }
  }
}

/**
 * Generates an Executive-style PDF natively using jsPDF API.
 */
function buildExecutivePdf(doc: jsPDF, resume: Resume) {
  const data = resume.data ?? ({} as any);
  const profile = (data.profile || {}) as ProfileData;
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const extras = data.extras;

  let y = MARGIN + 10; // Extra padding for executive

  // Header: Name
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  const name = profile.fullName || "Untitled Resume";
  doc.text(name, PAGE_WIDTH / 2, y, { align: "center" });
  y += 7;

  // Header: Headline
  if (isNonEmpty(profile.headline)) {
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text(profile.headline, PAGE_WIDTH / 2, y, { align: "center" });
    y += 6;
  }

  // Header: Contact Info
  const headerLine = [profile.location, profile.email, profile.phone]
    .filter(isNonEmpty)
    .join("  •  ");

  if (isNonEmpty(headerLine)) {
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(headerLine, PAGE_WIDTH / 2, y, { align: "center" });
    y += 5;
  }

  // Header: Links
  const links = (profile.links || [])
    .map((l: any) => (typeof l === "string" ? l : l.url))
    .filter(isNonEmpty);

  if (links.length > 0) {
    doc.setFontSize(11);
    doc.text(links.join("  •  "), PAGE_WIDTH / 2, y, { align: "center" });
    y += 5;
  }

  y += 5;
  // Separator Line
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.5);
  doc.line(MARGIN + 10, y, PAGE_WIDTH - MARGIN - 10, y);
  y += 8;

  const leftColWidth = 45;
  const rightColX = MARGIN + 10 + leftColWidth + 5;
  const rightColWidth = CONTENT_WIDTH - 20 - leftColWidth - 5;

  // Helper for Section Titles
  const addSectionTitle = (title: string) => {
    y = checkPageBreak(doc, y, 10);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), MARGIN + 10, y, { charSpace: 1.5 });
  };

  // Summary
  if (isNonEmpty(profile.summary)) {
    addSectionTitle("Summary");
    y += 6;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    y = writeWrappedText(
      doc,
      profile.summary,
      MARGIN + 10,
      y,
      CONTENT_WIDTH - 20,
      5,
    );
    y += 5;
  }

  // Experience
  if (experience && experience.length > 0) {
    addSectionTitle("Experience");
    y += 6;

    for (const job of experience) {
      y = checkPageBreak(doc, y, 15);

      // Left Col: Dates & Location
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      const dates = `${job.start || ""} — ${job.end || ""}`;
      let leftY = writeWrappedText(doc, dates, MARGIN + 10, y, leftColWidth, 4);

      if (isNonEmpty(job.location)) {
        leftY = writeWrappedText(
          doc,
          job.location,
          MARGIN + 10,
          leftY,
          leftColWidth,
          4,
        );
      }

      // Right Col: Role & Company
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      let roleLine = job.role || "";
      if (isNonEmpty(job.company)) roleLine += ` at ${job.company}`;
      if (isNonEmpty(job.employment_type))
        roleLine += ` (${job.employment_type})`;

      doc.text(roleLine, rightColX, y);
      y += 5;

      // Right Col: Highlights
      if (job.highlights && job.highlights.length > 0) {
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        for (const h of job.highlights) {
          y = checkPageBreak(doc, y, 5);
          doc.text("•", rightColX, y);
          y = writeWrappedText(doc, h, rightColX + 4, y, rightColWidth - 4, 5);
        }
      } else {
        y += 3;
      }

      y = Math.max(y, leftY);
    }
    y += 5;
  }

  // Education
  if (education && education.length > 0) {
    addSectionTitle("Education");
    y += 6;

    for (const edu of education) {
      y = checkPageBreak(doc, y, 10);

      // Left Col: Dates
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      const dates = `${edu.start || ""} — ${edu.end || ""}`;
      const leftY = writeWrappedText(
        doc,
        dates,
        MARGIN + 10,
        y,
        leftColWidth,
        4,
      );

      // Right Col: Degree & College
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      let degLine = edu.degree || "";
      if (isNonEmpty(edu.field)) degLine += `, ${edu.field}`;
      doc.text(degLine, rightColX, y);
      y += 5;

      doc.setFont("times", "normal");
      doc.text(edu.college || "", rightColX, y);
      if (isNonEmpty(edu.gpa)) {
        y += 4;
        doc.setFontSize(10);
        doc.text(`GPA: ${edu.gpa}`, rightColX, y);
      }

      y = Math.max(y, leftY) + 6;
    }
    y += 2;
  }

  // Skills
  if (skills && skills.length > 0) {
    addSectionTitle("Skills");
    y += 6;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    y = writeWrappedText(
      doc,
      skills.join(", "),
      MARGIN + 10,
      y,
      CONTENT_WIDTH - 20,
      5,
    );
    y += 5;
  }

  // Extras
  const hasProjects = extras?.projects && extras.projects.length > 0;
  const hasCerts = extras?.certifications && extras.certifications.length > 0;
  const hasLangs = extras?.languages && extras.languages.length > 0;

  if (hasProjects || hasCerts || hasLangs) {
    addSectionTitle("Additional");
    y += 6;

    const extrasX = MARGIN + 10;

    if (hasCerts) {
      y = checkPageBreak(doc, y, 5);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("Certifications", extrasX, y);
      y += 5;
      doc.setFont("times", "normal");

      for (const c of extras.certifications!) {
        y = checkPageBreak(doc, y, 5);
        let cLine = c.name || "";
        if (isNonEmpty(c.issuer)) cLine += ` — ${c.issuer}`;
        if (isNonEmpty(c.date)) cLine += ` (${c.date})`;
        if (isNonEmpty(c.url)) cLine += ` — ${c.url}`;
        y = writeWrappedText(doc, cLine, extrasX, y, CONTENT_WIDTH - 20, 5);
      }
      y += 3;
    }

    if (hasProjects) {
      y = checkPageBreak(doc, y, 5);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("Projects", extrasX, y);
      y += 5;
      doc.setFont("times", "normal");

      for (const p of extras.projects!) {
        y = checkPageBreak(doc, y, 5);
        let pLine = p.name || "";
        if (isNonEmpty(p.url)) pLine += ` — ${p.url}`;
        doc.text(pLine, extrasX, y);
        y += 4;
        if (isNonEmpty(p.description)) {
          y = writeWrappedText(
            doc,
            p.description,
            extrasX,
            y,
            CONTENT_WIDTH - 20,
            5,
          );
        }
      }
      y += 3;
    }

    if (hasLangs) {
      y = checkPageBreak(doc, y, 5);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("Languages", extrasX, y);
      y += 5;
      doc.setFont("times", "normal");

      const langs = extras
        .languages!.map((l) => {
          let str = l.name;
          if (isNonEmpty(l.level)) str += ` (${l.level})`;
          return str;
        })
        .join(", ");

      if (langs) {
        y = writeWrappedText(doc, langs, extrasX, y, CONTENT_WIDTH - 20, 5);
      }
    }
  }
}

/**
 * Generates an Modern Tech-style PDF natively using jsPDF API.
 */
function buildModernTechPdf(doc: jsPDF, resume: Resume) {
  const data = resume.data ?? ({} as any);
  const profile = (data.profile || {}) as ProfileData;
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const extras = data.extras;

  let y = MARGIN + 10;

  // Theme Color (Blue-500 equivalent)
  const primaryColor = { r: 59, g: 130, b: 246 };

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  const name = profile.fullName || "Untitled Resume";
  doc.text(name, MARGIN, y);

  const rightAlignX = PAGE_WIDTH - MARGIN;

  // Contact Info (Right Aligned)
  let contactY = y - 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85); // slate-700

  if (isNonEmpty(profile.location)) {
    doc.text(profile.location, rightAlignX, contactY, { align: "right" });
    contactY += 5;
  }

  if (isNonEmpty(profile.email)) {
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.text(profile.email, rightAlignX, contactY, { align: "right" });
    doc.setTextColor(51, 65, 85);
    contactY += 5;
  }

  if (isNonEmpty(profile.phone)) {
    doc.text(profile.phone, rightAlignX, contactY, { align: "right" });
    contactY += 5;
  }

  const links = (profile.links || [])
    .map((l: any) => (typeof l === "string" ? l : l.url))
    .filter(isNonEmpty);

  if (links.length > 0) {
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    for (const link of links.slice(0, 4)) {
      doc.text(link, rightAlignX, contactY, { align: "right" });
      contactY += 5;
    }
    doc.setTextColor(51, 65, 85);
  }

  // Back to Left side (Headline & Summary)
  y += 6;
  if (isNonEmpty(profile.headline)) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.text(profile.headline, MARGIN, y);
    y += 6;
  }

  if (isNonEmpty(profile.summary)) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59); // slate-800
    // Wrap to 60% of page to avoid overlapping right-aligned contact
    y = writeWrappedText(
      doc,
      profile.summary,
      MARGIN,
      y,
      CONTENT_WIDTH * 0.6,
      5,
    );
  }

  // Ensure y clears the contact info block
  if (y < contactY) {
    y = contactY;
  }

  y += 5;
  // Separator Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  // --- Two Column Layout ---
  const leftColWidth = CONTENT_WIDTH * 0.65; // Approx 65/35 split
  const rightColX = MARGIN + leftColWidth + 10;
  const rightColWidth = CONTENT_WIDTH - leftColWidth - 10;

  // Track Y position of both columns
  let mainY = y;
  let sideY = y;

  const addHeader = (title: string, currentY: number, x: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(title.toUpperCase(), x, currentY, { charSpace: 1.2 });
    return currentY + 6;
  };

  // --- Main Column (Left) ---

  // Experience
  if (experience && experience.length > 0) {
    mainY = addHeader("Experience", mainY, MARGIN);

    for (const job of experience) {
      mainY = checkPageBreak(doc, mainY, 15);

      let expLeftY = mainY;
      let expRightY = mainY;
      const leftPartWidth = leftColWidth * 0.65 - 5;
      const rightPartWidth = leftColWidth * 0.35 - 5;
      const rightEdgeX = MARGIN + leftColWidth;

      // Top row: Role
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      expLeftY = writeWrappedText(
        doc,
        job.role || "",
        MARGIN,
        expLeftY,
        leftPartWidth,
        5,
      );

      // Company
      if (isNonEmpty(job.company)) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105); // slate-700
        expLeftY = writeWrappedText(
          doc,
          `@ ${job.company}`,
          MARGIN,
          expLeftY,
          leftPartWidth,
          4,
        );
      }

      // Second row: Type
      let subLine = "";
      if (isNonEmpty(job.employment_type)) subLine += job.employment_type;

      if (subLine) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139); // slate-500
        expLeftY = writeWrappedText(
          doc,
          subLine,
          MARGIN,
          expLeftY,
          leftPartWidth,
          4,
        );
      }

      // Right Col (Dates & Location)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // slate-600
      const dates = `${job.start || ""} — ${job.end || ""}`;
      const dateLines = doc.splitTextToSize(dates, rightPartWidth);
      for (const l of dateLines) {
        doc.text(l, rightEdgeX, expRightY, { align: "right" });
        expRightY += 5;
      }

      if (isNonEmpty(job.location)) {
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        const locLines = doc.splitTextToSize(job.location, rightPartWidth);
        for (const l of locLines) {
          doc.text(l, rightEdgeX, expRightY, { align: "right" });
          expRightY += 5;
        }
      }

      mainY = Math.max(expLeftY, expRightY);

      // Highlights
      if (job.highlights && job.highlights.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        for (const h of job.highlights) {
          mainY = checkPageBreak(doc, mainY, 5);
          doc.text("•", MARGIN, mainY);
          mainY = writeWrappedText(
            doc,
            h,
            MARGIN + 4,
            mainY,
            leftColWidth - 4,
            5,
          );
        }
      } else {
        mainY += 3;
      }
      mainY += 3;
    }
    mainY += 5;
  }

  // Education (Main Col)
  if (education && education.length > 0) {
    mainY = addHeader("Education", mainY, MARGIN);

    for (const edu of education) {
      mainY = checkPageBreak(doc, mainY, 10);

      let eduLeftY = mainY;
      let eduRightY = mainY;
      const leftPartWidth = leftColWidth * 0.65 - 5;
      const rightPartWidth = leftColWidth * 0.35 - 5;
      const rightEdgeX = MARGIN + leftColWidth;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      eduLeftY = writeWrappedText(
        doc,
        edu.college || "",
        MARGIN,
        eduLeftY,
        leftPartWidth,
        5,
      );

      let degLine = edu.degree || "";
      if (isNonEmpty(edu.field)) degLine += `, ${edu.field}`;
      if (isNonEmpty(edu.gpa)) degLine += ` — GPA ${edu.gpa}`;

      if (degLine) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85); // slate-700
        eduLeftY = writeWrappedText(
          doc,
          degLine,
          MARGIN,
          eduLeftY,
          leftPartWidth,
          5,
        );
        eduLeftY += 1;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // slate-600
      const dates = `${edu.start || ""} — ${edu.end || ""}`;
      const dateLines = doc.splitTextToSize(dates, rightPartWidth);
      for (const l of dateLines) {
        doc.text(l, rightEdgeX, eduRightY, { align: "right" });
        eduRightY += 5;
      }

      mainY = Math.max(eduLeftY, eduRightY) + 2;
    }
    mainY += 2;
  }

  // Projects (Main Col)
  if ((extras?.projects?.length ?? 0) > 0) {
    mainY = addHeader("Projects", mainY, MARGIN);

    for (const p of extras!.projects!) {
      mainY = checkPageBreak(doc, mainY, 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      mainY = writeWrappedText(
        doc,
        p.name || "",
        MARGIN,
        mainY,
        leftColWidth,
        5,
      );

      if (isNonEmpty(p.url)) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
        mainY = writeWrappedText(doc, p.url, MARGIN, mainY, leftColWidth, 4);
      }

      mainY += 1;

      if (isNonEmpty(p.description)) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        mainY = writeWrappedText(
          doc,
          p.description,
          MARGIN,
          mainY,
          leftColWidth,
          5,
        );
      }
      mainY += 3;
    }
  }

  // --- Sidebar Column (Right) ---

  // Skills
  const skillList = skills.filter((s: string) => isNonEmpty(s));
  if (skillList.length > 0) {
    sideY = addHeader("Skills", sideY, rightColX);

    // Simple block list for skills in the sidebar to simulate the "pills" look
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    let currentSkillStr = "";

    // Primitive pill wrapping simulation
    for (const s of skillList) {
      if (doc.getTextWidth(currentSkillStr + ", " + s) > rightColWidth) {
        sideY = writeWrappedText(
          doc,
          currentSkillStr,
          rightColX,
          sideY,
          rightColWidth,
          5,
        );
        currentSkillStr = s;
      } else {
        currentSkillStr += (currentSkillStr ? ", " : "") + s;
      }
    }
    if (currentSkillStr) {
      sideY = writeWrappedText(
        doc,
        currentSkillStr,
        rightColX,
        sideY,
        rightColWidth,
        5,
      );
    }
    sideY += 5;
  }

  // Certifications
  if ((extras?.certifications?.length ?? 0) > 0) {
    sideY = addHeader("Certifications", sideY, rightColX);

    for (const c of extras!.certifications!) {
      sideY = checkPageBreak(doc, sideY, 10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59); // slate-800
      sideY = writeWrappedText(
        doc,
        c.name || "",
        rightColX,
        sideY,
        rightColWidth,
        4,
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600

      let subLine = c.issuer || "";
      if (isNonEmpty(c.date)) subLine += ` • ${c.date}`;

      if (subLine) {
        sideY = writeWrappedText(
          doc,
          subLine,
          rightColX,
          sideY,
          rightColWidth,
          4,
        );
      }

      if (isNonEmpty(c.url)) {
        doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
        sideY = writeWrappedText(
          doc,
          c.url,
          rightColX,
          sideY,
          rightColWidth,
          4,
        );
      }
      sideY += 2;
    }
    sideY += 3;
  }

  // Languages
  if ((extras?.languages?.length ?? 0) > 0) {
    sideY = addHeader("Languages", sideY, rightColX);

    doc.setFont("helvetica", "normal");
    for (const l of extras!.languages!) {
      sideY = checkPageBreak(doc, sideY, 5);

      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(l.name || "", rightColX, sideY);

      if (isNonEmpty(l.level)) {
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(l.level, PAGE_WIDTH - MARGIN, sideY, { align: "right" });
      }
      sideY += 5;
    }
  }
}

/**
 * Main export function called from the UI.
 */
export async function exportResumeToPdfNative(resume: Resume) {
  try {
    const doc = new jsPDF(PDF_CONFIG);

    // Add custom fonts here if needed in the future using jsPDF's addFileToVFS

    // Determine which native build function to use
    const tid = (resume as any).template_id ?? resume.templateId ?? "";

    if (tid.startsWith("executive")) {
      buildExecutivePdf(doc, resume);
    } else if (tid.startsWith("modern-tech")) {
      buildModernTechPdf(doc, resume);
    } else {
      buildAtsPdf(doc, resume);
    }

    const filename = `${(resume.data?.profile?.fullName || resume.title || "resume").replace(/\s+/g, "_")}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error("Failed to generate PDF natively:", error);
    alert("Failed to export PDF. Please try again.");
  }
}
