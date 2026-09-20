import { Movie } from "../types/movie";
import axios from "axios";


export interface MoviesResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

const MY_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3"

export async function fetchMovies(query:string): Promise<Movie[]> {
    

const response = await axios.get<MoviesResponse>(`${BASE_URL}/search/movie` , {
    params: {
        query,
        language: "en-US",
    }, 
    headers: {
    Authorization: `Bearer ${MY_TOKEN}`,
},
});

return response.data.results
}