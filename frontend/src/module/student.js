import { apiGet, apiPost } from "./api";

export const getStudents = () => apiGet("/api/students");

export const createStudent = (data) => apiPost("/api/students", data);