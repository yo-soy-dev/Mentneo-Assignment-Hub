import api from "./axios";

export const assignmentApi = {
  getAll: () =>
    api.get("/assignments"),

  create: (data: any) =>
    api.post("/assignments", data),

  getStudentAssignments: () =>
    api.get("/assignments/student"), 
};
