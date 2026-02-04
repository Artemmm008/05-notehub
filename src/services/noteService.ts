import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

const noteUT = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export const fetchNotes = async (search: string, page: number): Promise<FetchNotesResponse> => {
  const res = await noteUT.get<FetchNotesResponse>("/notes", {
    params: {
      search,
      page,
      perPage: 12,
    },
  });
  return res.data;
};

export const createNote = async (note: NewNoteData): Promise<Note> => {
  const res = await noteUT.post<Note>("/notes", note);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await noteUT.delete<Note>(`/notes/${id}`);
  return res.data;
};
