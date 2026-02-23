import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { resumeApi } from "@/lib/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Resume, UpdateMetaRequest } from "@/types/resume";
import { useState, useEffect } from "react";
import { useToast } from "@/contexts/toastContext";

interface DialogEditResumeProps {
  resume: Resume;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogEditResume({
  resume,
  isOpen,
  onOpenChange,
}: DialogEditResumeProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [title, setTitle] = useState(resume.title || "");
  const [selectedTemplate, setSelectedTemplate] = useState(
    (resume as any).template_id ?? resume.templateId ?? "ats-1",
  );

  useEffect(() => {
    if (isOpen) {
      setTitle(resume.title || "");
      setSelectedTemplate(
        (resume as any).template_id ?? resume.templateId ?? "ats-1",
      );
    }
  }, [isOpen, resume]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateMetaRequest) =>
      resumeApi.updateResumeMeta(resume.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      showToast("Resume details updated", "success");
      onOpenChange(false);
    },
    onError: () => {
      showToast("Failed to update resume details", "error");
    },
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await updateMutation.mutateAsync({
      title,
      templateId: selectedTemplate,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Edit Resume Details
          </DialogTitle>
          <DialogDescription className="text-center">
            Update the template and name for this resume.
          </DialogDescription>
          <form onSubmit={handleUpdate}>
            <div className="flex flex-col gap-5 mt-8 px-10">
              <div className="flex flex-col gap-2">
                <Input
                  id="resumeName"
                  name="resumeName"
                  type="text"
                  placeholder="Resume Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Select
                  name="template"
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ats-1">Ats</SelectItem>
                      <SelectItem value="executive-1">Executive</SelectItem>
                      <SelectItem value="modern-tech-1">Modern Tech</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  type="submit"
                  className={`bg-gradient-blue ${
                    updateMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100 cursor-pointer"
                  } text-white px-8 py-2 rounded-lg font-semibold shadow-premium hover-lift transition-smooth w-full`}
                  disabled={updateMutation.isPending || !title.trim()}
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
