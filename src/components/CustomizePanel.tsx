"use client";

import { ThemeConfig } from "@/types/resume";
import {
  ResumeTemplateId,
  TEMPLATE_CUSTOMIZATION,
} from "@/lib/resumeTemplateConfig";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CustomizePanelProps = {
  templateId: ResumeTemplateId;
  styles: ThemeConfig;
  onChange: (next: Partial<ThemeConfig>) => void;
  onReset?: () => void;
};

const FONT_OPTIONS: Array<{ label: string; value: string }> = [
  {
    label: "Inter (system)",
    value:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, Noto Sans, sans-serif",
  },
  { label: "Arial", value: "Arial, ui-sans-serif, system-ui, sans-serif" },
  { label: "Georgia", value: "Georgia, ui-serif, serif" },
  { label: "Times New Roman", value: "'Times New Roman', ui-serif, serif" },
  {
    label: "Courier New",
    value:
      "'Courier New', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
];

export function CustomizePanel({
  templateId,
  styles,
  onChange,
  onReset,
}: CustomizePanelProps) {
  const caps = TEMPLATE_CUSTOMIZATION[templateId];

  return (
    <div className="w-full max-w-md">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Customize</CardTitle>
          <CardDescription>
            Adjust styling for the resume preview.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {caps.isFontFamilyEditable && (
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font family</Label>
                <select
                  id="fontFamily"
                  value={styles.fontFamily}
                  onChange={(e) => onChange({ fontFamily: e.target.value })}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                >
                  <option value="">Template default</option>
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.label} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500">
                  Applies to the whole resume preview.
                </div>
              </div>
            )}

            {caps.isFontSizeEditable && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="fontSize">Font size</Label>
                  <div className="text-xs text-gray-500">
                    {styles.fontSize}px
                  </div>
                </div>
                <Input
                  id="fontSize"
                  type="range"
                  min={10}
                  max={16}
                  step={1}
                  value={styles.fontSize}
                  onChange={(e) => onChange({ fontSize: e.target.value })}
                />
              </div>
            )}

            {caps.isSpacingEditable && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="pagePaddingMm">Page padding</Label>
                  <div className="text-xs text-gray-500">
                    {styles.pagePadding}mm
                  </div>
                </div>
                <Input
                  id="pagePaddingMm"
                  type="range"
                  min={6}
                  max={16}
                  step={1}
                  value={styles.pagePadding}
                  onChange={(e) =>
                    onChange({ pagePadding: Number(e.target.value).toString() })
                  }
                />
                <div className="text-xs text-gray-500">
                  Controls the resume page margins/padding.
                </div>
              </div>
            )}

            <div className="flex">
              {onReset && (
                <Button type="button" variant="outline" onClick={onReset}>
                  Reset styles
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomizePanel;
