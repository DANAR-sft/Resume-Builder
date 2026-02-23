import apiClient from "./api-client";

export interface Template {
  id: string;
  name: string;
  category?: string;
  previewUrl?: string;
  [key: string]: any;
}

export const templateApi = {
  async getTemplates(): Promise<Template[]> {
    const response = await apiClient.get<Template[]>("/templates");
    return response.data;
  },
};
