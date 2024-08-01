import { useEffect, useRef, useState } from "react";
import StarRating from "./components/StarRating.js";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "be659aa8";
const YOUTUBE_API_KEY = "AIzaSyB6RI5uDnYY0rWlc5aujEKKVxjTDNnb11A";

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>iPapkorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const inputel = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputel.current) return;
        if (e.code === "Enter") {
          inputel.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);

      return () => document.addEventListener("keydown", callback);
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputel}
    />
  );
}

function SearchResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelect }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelect={onSelect} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelect }) {
  return (
    <li
      key={movie.imdbID}
      onClick={() => {
        onSelect(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function WatchList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Watched movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function Watched({ movie, onDelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          ❌
        </button>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [isSelected, setIsSelected] = useState(null);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  function handleSelected(id) {
    setIsSelected((isSelected) => (id === isSelected ? null : id));
  }

  function closeMovie() {
    setIsSelected(null);
  }

  function watchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatch(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("Something went wrong!");
          }

          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movie not Found!");
          }

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelect={handleSelected} />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {isSelected ? (
            <MovieDetails
              isSelected={isSelected}
              onClose={closeMovie}
              onAddWatch={watchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchList watched={watched} onDelete={handleDeleteWatch} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Error({ message }) {
  return <p className="error">{message}</p>;
}

function Loader() {
  return <p className="loader">Loading..</p>;
}

function MovieDetails({ isSelected, onClose, onAddWatch, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [trailer, setTrailer] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(isSelected);

  const count = useRef(0);

  useEffect(
    function () {
      if (userRating) {
        count.current = count.current + 1;
      }
    },
    [userRating]
  );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: isSelected,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: count.current,
    };

    onAddWatch(newWatchedMovie);
    onClose();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${isSelected}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }

      async function getTrailer() {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${title} trailer&type=video&key=${YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        if (data.items.length > 0) {
          setTrailer(data.items[0].id.videoId);
        }
      }

      getMovieDetails();
      getTrailer();
    },
    [isSelected, title]
  );

  useEffect(
    function () {
      if (title) document.title = `Movie | ${title}`;

      return () => {
        document.title = "iPapkorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    // onSetRating={setUserRating}
                    onSetCurrent={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {userRating}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
            {trailer && (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailer}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
          </section>
        </>
      )}
    </div>
  );
}
