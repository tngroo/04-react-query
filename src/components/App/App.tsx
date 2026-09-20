import { useState } from "react";
import toast from "react-hot-toast";

import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { Movie } from "../../types/movie";

export default function App(){
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

    async function handleSearch(query: string) {
        setMovies([])
        setLoader(true)
        setError(false)       
    

    try {
        const response = await fetchMovies(query);

        if(response.length === 0){
            setError(true)
            toast.error("No movies found for your request.")
            return
        }
        setMovies(response);
    }
    catch{
        setError(true)
        toast.error("Something went wrong. Please try again.")
    }
    finally{
        setLoader(false)
    }
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
    {loader && <Loader/>}
    {error && <ErrorMessage/>}
    {!loader && !error && movies.length > 0 && (
        <MovieGrid movies ={movies} onSelect={handleSelectMovie}/>
    )}

    {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
    )}
    </>
)
}


