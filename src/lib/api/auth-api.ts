import apiClient from "./api-client";

export const authApi = {
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};
