import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Label } from "./ui/label";
import { resumeApi } from "@/lib/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { CreateResumeRequest } from "@/types/resume";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DialogCreateResume() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("ats-1");

  const createMutation = useMutation({
    mutationFn: resumeApi.createResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleCreate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const title = form.get("resumeName") as string;

    const result = await createMutation.mutateAsync({
      title,
      templateId: selectedTemplate,
    } as CreateResumeRequest);

    // Redirect to builder with the new resume ID
    setIsOpen(false);
    router.push(`/design/builder/${result.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="bg-gradient-blue text-white px-8 py-3.5 rounded-lg font-semibold shadow-premium hover-lift transition-smooth"
        onClick={() => {
          createMutation.reset();
          setIsOpen(true);
        }}
      >
        Create New Resume
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Create New Resume
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose a template and name for your new resume.
          </DialogDescription>
          <form onSubmit={handleCreate}>
            <div className="flex flex-col gap-5 mt-8 px-10">
              <div className="flex flex-col gap-2">
                <Input
                  id="resumeName"
                  name="resumeName"
                  type="text"
                  placeholder="Resume Name"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Select
                  name="template"
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger className="w-[180px]">
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
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className={`bg-gradient-blue ${createMutation.isPending ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"} text-white px-8 py-2 rounded-lg font-semibold shadow-premium hover-lift transition-smooth w-full`}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </button>
                {createMutation.isError && (
                  <p className="text-red-500">Create Failed</p>
                )}
                {createMutation.isSuccess && (
                  <p className="text-green-500">Create Success</p>
                )}
              </div>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
