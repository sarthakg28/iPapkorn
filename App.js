import { useEffect, useState } from "react";
import StarRating from "./components/StarRating.js";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "be659aa8";

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
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
/*function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);

  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchList watched={watched} />
        </>
      )}
    </div>
  );
}
*/
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
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [isSelected, setIsSelected] = useState(null);

  function handleSelected(id) {
    setIsSelected((isSelected) => (id === isSelected ? null : id));
  }

  function closeMovie() {
    setIsSelected(null);
  }
  // const query = "krish";

  function watchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatch(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

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
          // console.log(data);
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

  // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //   .then((res) => res.json())
  //   .then((data) => setMovies(data.Search));
  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResults movies={movies} />
      </Navbar>
      <Main>
        {/* <Box element={<MovieList movies={movies} />} />

        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              , <WatchList watched={watched} />
            </>
          }
        /> */}
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
              // onClose={closeMovie}
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

  const isWatched = watched.map((movie) => movie.imdbID).includes(isSelected);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === isSelected
  )?.userRating;

  const {
    Title: title,
    // Year: year,
    imdbRating,
    Actors: actors,
    Director: director,
    Genre: genre,
    Awards: awards,
    Plot: plot,
    Runtime: runtime,
    Poster: poster,
    Released: released,
  } = movie;

  function handleAdd() {
    const newMovie = {
      imdbID: isSelected,
      imdbRating: Number(imdbRating),
      title,
      runtime: Number(runtime.split(" ").at(0)),
      poster,
      userRating,
    };

    onAddWatch(newMovie);
    onClose(isSelected);
  }
  // console.log(title, year);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${isSelected}`
        );
        const data = await res.json();
        // console.log(data);
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [isSelected]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "iPapkorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      document.addEventListener("keydown", function (e) {
        if (e.code === "Escape") {
          onClose();
        }
        return function () {
          document.removeEventListener();
        };
      });
    },
    [onClose]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            {userRating > 0 && (
              <button className="btn-back" onClick={onClose}>
                &larr;
              </button>
            )}

            <img src={poster} alt={isSelected.title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>👌</span>
                {imdbRating} IMDB Rating
              </p>
              <p>Awards : {awards}</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    color="yellow"
                    onSetCurrent={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>You have rated this movie with {watchedUserRating} 👌.</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring : {actors}</p>
            <p>Directed by : {director}</p>
          </section>
          {/* {isSelected} */}
        </>
      )}
    </div>
  );
}
