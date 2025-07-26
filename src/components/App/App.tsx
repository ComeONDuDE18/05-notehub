import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";


import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { FetchNotesResponse } from "../../services/noteService";



import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [debouncedSearchTerm] = useDebounce(search, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const { data, isLoading, isError, isSuccess } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearchTerm],
    queryFn: () =>
      fetchNotes(page, 12, debouncedSearchTerm), 
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        
        <SearchBox value={search} onChange={setSearch} />

        {isLoading && <Loader />}

        {isError && <ErrorMessage />}

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setModalIsOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isSuccess && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && <p>No notes found</p>
      )}

      {modalIsOpen && (
        <Modal onClose={() => setModalIsOpen(false)}>
          <NoteForm onClose={() => setModalIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
