import api from "./axios";

export const submissionApi = {
  submit: (id: string, data: FormData) =>
    api.post(`/assignments/${id}/submit`, data),

  getMy: () =>
    api.get("/submissions/me"),

  getAll: () =>
    api.get("/submissions"),

  review: (id: string) =>
    api.patch(`/submissions/${id}/review`),
};
