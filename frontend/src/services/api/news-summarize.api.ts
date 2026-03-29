import apiClient from './api-client';

export interface SummarizeResponse {
  ok: boolean;
  summarizedText: string;
  compressionRatio?: number;
  fromCache: boolean;
}

export const newsSummarizeApi = {
  async summarize(id: string, maxLength?: number): Promise<SummarizeResponse> {
    const response = await apiClient.post<SummarizeResponse>(`/api/news/${id}/summarize`, {
      maxLength,
    });
    return response.data;
  },
};
