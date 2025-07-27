import axios from "axios";
import type { Note, NoteTag } from "../types/note";




axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
const myApiKey = `Bearer ${myKey}`;
axios.defaults.headers.common['Authorization'] = myApiKey;

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (searchText: string, page: number) => {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      ...(searchText !== "" && { search: searchText }),
      page,
      perPage: 12,
    },
  });
  return response.data;
};

export const createNote = async (note: {
    title: string;
    content: string;
    tag: NoteTag;
}): Promise<Note> => {
    const response = await axios.post<Note>('/notes', note);

    return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
    const response = await axios.delete<Note>(`/notes/${id}`);
    return response.data;
};

 