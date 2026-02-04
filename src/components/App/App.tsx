import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, deleteNote } from "../../services/noteService";
import toast, { Toaster} from "react-hot-toast";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() { 

const queryClient = useQueryClient();
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [isModalOpen, setIsModalOpen] = useState(false);

    const [debouncedSearch] = useDebounce(search, 300);

const { data, isLoading, isError } = useQuery({
queryKey: ["notes", debouncedSearch, page],
queryFn: () => fetchNotes(debouncedSearch, page),
});

const totalPages = data?.totalPages ?? 0; 
 
const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);

const { mutate: deleteNoteMutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted!");
    },
    onError: () => toast.error("Error deleting note")
});
    
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
            onDelete={deleteNoteMutate} 
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

