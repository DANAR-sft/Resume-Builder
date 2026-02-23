import apiClient from "./api-client";
import type {
  Resume,
  CreateResumeRequest,
  UpdateMetaRequest,
  UpdateProfileRequest,
  UpdateExperienceRequest,
  UpdateEducationRequest,
  UpdateSkillsRequest,
  UpdateExtrasRequest,
  UpdateThemeRequest,
  UpdateSectionOrderRequest,
} from "@/types/resume";

export const resumeApi = {
  async getResumes(): Promise<Resume[]> {
    const response = await apiClient.get<Resume[]>("/resumes");
    return response.data;
  },

  async createResume(data?: CreateResumeRequest): Promise<Resume> {
    const response = await apiClient.post<Resume>("/resumes", data || {});
    return response.data;
  },

  async getResumeById(id: string): Promise<Resume> {
    const response = await apiClient.get<Resume>(`/resumes/${id}`);
    return response.data;
  },

  async updateResumeMeta(id: string, data: UpdateMetaRequest): Promise<Resume> {
    const response = await apiClient.patch<Resume>(`/resumes/${id}/meta`, data);
    return response.data;
  },

  async updateResumeProfile(
    id: string,
    data: UpdateProfileRequest,
  ): Promise<Resume> {
    const response = await apiClient.patch<Resume>(
      `/resumes/${id}/sections/profile`,
      data,
    );
    return response.data;
  },

  async updateResumeExperience(
    id: string,
    data: UpdateExperienceRequest,
  ): Promise<Resume> {
    const response = await apiClient.patch<Resume>(
      `/resumes/${id}/sections/experience`,
      data,
    );
    return response.data;
  },

  async updateResumeEducation(
    id: string,
    data: UpdateEducationRequest,
  ): Promise<Resume> {
    const response = await apiClient.patch<Resume>(
      `/resumes/${id}/sections/education`,
      data,
    );
    return response.data;
  },

  async updateResumeSkills(
    id: string,
    data: UpdateSkillsRequest,
  ): Promise<Resume> {
    const response = await apiClient.patch<Resume>(
      `/resumes/${id}/sections/skills`,
      data,
    );
    return response.data;
  },

  async updateResumeExtras(
    id: string,
    data: UpdateExtrasRequest,
  ): Promise<Resume> {
    const response = await apiClient.patch<Resume>(
      `/resumes/${id}/sections/extras`,
      data,
    );
    return response.data;
  },

  async updateResumeTheme(
    id: string,
    data: UpdateThemeRequest,
  ): Promise<Resume> {
    const response = await apiClient.patch<Resume>(
      `/resumes/${id}/theme`,
      data,
    );
    return response.data;
  },

  async updateResumeSectionOrder(
    id: string,
    data: UpdateSectionOrderRequest,
  ): Promise<Resume> {
    const response = await apiClient.patch<Resume>(
      `/resumes/${id}/section-order`,
      data,
    );
    return response.data;
  },

  async deleteResume(id: string): Promise<void> {
    await apiClient.delete(`/resumes/${id}`);
  },

  async duplicateResume(id: string): Promise<Resume> {
    const response = await apiClient.post<Resume>(`/resumes/${id}/duplicate`);
    return response.data;
  },
};
