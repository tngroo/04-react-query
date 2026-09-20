import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies, MoviesResponse } from "../../services/movieService";
import { Movie } from "../../types/movie";
import css from "./App.module.css"

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (nextPage: number) => void;
}
function Pagination ({ totalPages, currentPage, onPageChange} : PaginationProps) {
    return (
        <ReactPaginate
        pageCount={totalPages}
pageRangeDisplayed={5}
marginPagesDisplayed={1}
onPageChange={({ selected }) => onPageChange(selected + 1)}
forcePage={currentPage - 1}
containerClassName={css.pagination}
activeClassName={css.active}
nextLabel="→"
previousLabel="←"
/>
    )
}
export default function App(){
    const [query, setQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1);


    const {data: movies, isLoading, isError} = useQuery<MoviesResponse>({
        queryKey: ["movies", query, currentPage],
        queryFn: () => fetchMovies(query, currentPage),
        enabled: query.length > 0,
        placeholderData: keepPreviousData,
    })
const movieList = movies?.results ?? [];
const totalPages = movies?.total_pages ?? 0;

useEffect(() => {
    if (movies && movies.results.length === 0) {
        toast.error(`No movies found for your request.`)
    }
}, [movies])
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

    function handleSearch(newQuery: string) {
       setQuery(newQuery)  
}

function handleSelectMovie(movie: Movie){
    setSelectedMovie(movie)
}

function handleCloseModal(){
    setSelectedMovie(null)
}
return (
    <>
    <SearchBar onSubmit={handleSearch} />
    {isLoading && <Loader/>}
    {isError && <ErrorMessage/>}
    {!isLoading && !isError && movies && query.length > 0 && (
        <MovieGrid movies ={movieList} onSelect={handleSelectMovie}/>
    )}

    {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
    )}
    {movies && movies.results.length > 0 && (
    <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
    />
    )}
    </>
)
}


