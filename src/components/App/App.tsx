import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import { Toaster } from "react-hot-toast";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() { 

const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [isModalOpen, setIsModalOpen] = useState(false);

    const [debouncedSearch] = useDebounce(search, 300);

const { data, isLoading, isError } = useQuery({
queryKey: ["notes", debouncedSearch, page],
queryFn: () => fetchNotes(debouncedSearch, page),
placeholderData: keepPreviousData,
});

const totalPages = data?.totalPages ?? 0; 
 
const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);
    
return (
<div className={css.app}>
   <Toaster />    
   <header className={css.toolbar}>
        <SearchBox 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); 
            }} 
        />
        {totalPages > 1 && (
        <Pagination
            pageCount={totalPages}        
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
        />
        )}
        <button className={css.button} onClick={openModal}>
        Create note +
        </button>
    </header>

     <main>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
  
        {data && data.notes.length > 0 ? (
        <NoteList
            notes={data.notes}
        />
        ) : (
          !isLoading && <p>No notes found.</p>
        )}
     </main>
          {isModalOpen && (
        <NoteModal onClose={closeModal}>
        <NoteForm onClose={closeModal} />
        </NoteModal>
      )} 
</div>
    );
}

