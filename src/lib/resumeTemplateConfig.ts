export type ResumeTemplateId =
  | "ats"
  | "executive"
  | "modern-tech"
  | "minimalist-creative";

export type TemplateCustomizationCapabilities = {
  isColorEditable: boolean;
  isFontFamilyEditable: boolean;
  isFontSizeEditable: boolean;
  isSpacingEditable: boolean;
};

export const TEMPLATE_CUSTOMIZATION: Record<
  ResumeTemplateId,
  TemplateCustomizationCapabilities
> = {
  ats: {
    // ATS-friendly: keep high contrast + minimal styling
    isColorEditable: false,
    isFontFamilyEditable: true,
    isFontSizeEditable: true,
    isSpacingEditable: true,
  },
  executive: {
    // Conservative: allow typography tweaks, keep color minimal
    isColorEditable: false,
    isFontFamilyEditable: true,
    isFontSizeEditable: true,
    isSpacingEditable: true,
  },
  "modern-tech": {
    // Tech: accent color + density/layout tweaks are expected
    isColorEditable: false,
    isFontFamilyEditable: true,
    isFontSizeEditable: true,
    isSpacingEditable: true,
  },
  "minimalist-creative": {
    // Creative: typography + spacing; keep accent optional
    isColorEditable: false,
    isFontFamilyEditable: true,
    isFontSizeEditable: true,
    isSpacingEditable: true,
  },
};
