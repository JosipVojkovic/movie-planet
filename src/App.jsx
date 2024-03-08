import './style.css';
import {useState} from "react"
import { useEffect } from 'react';


export default function App() {

  const [movies, setMovies] = useState([])
  const [selectedMovieList, setSelectedMovieList] = useState("&primary_release_year=2024&sort_by=popularity.desc")
  const [selectedMovieId, setSelectedMovieId] = useState()
  const [movieInfo, setMovieInfo] = useState()
  const [selectedMovieGenre, setSelectedMovieGenre] = useState("Newest")
  const [pageNumber, setPageNumber] = useState(1)
  const [searchedMovies, setSearchedMovies] = useState()
  const [selectedNavIcon, setSelectedNavIcon] = useState(false)


  useEffect(() => {
    if(searchedMovies){
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=d4b39c99eaf4716d381f3d831106202c&query=${searchedMovies}&language=en-US&page=${pageNumber}`)
      .then(res => res.json())
      .then(json => setMovies(json.results))
    }
    else{
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=d4b39c99eaf4716d381f3d831106202c${selectedMovieList}&language=en-US&page=${pageNumber}`)
    .then(res => res.json())
    .then(json => setMovies(json.results))
    }
  }, [selectedMovieList, pageNumber, searchedMovies])
  
  useEffect(() => {
    if(selectedMovieId){
      fetch(`https://api.themoviedb.org/3/movie/${selectedMovieId}?api_key=d4b39c99eaf4716d381f3d831106202c&append_to_response=videos,credits`)
      .then(res => res.json())
      .then(json => setMovieInfo(json))
    }
  }, [selectedMovieId])

  function handleOnclick(name) {

    setSelectedMovieGenre(name)

    setSelectedMovieList(() => {
      if(name === "Newest"){
        return "&primary_release_year=2024&sort_by=popularity.desc"
      }
      else if(name === "Action"){
        return "&with_genres=28"
      }
      else if(name === "Adventure"){
        return "&with_genres=12"
      }
      else if(name === "Drama"){
        return "&with_genres=18"
      }
      else if(name === "Sci-fi"){
        return "&with_genres=878"
      }
      else if(name === "Horror"){
        return "&with_genres=27"
      }
    })

    setPageNumber(1)

  }

  console.log(movies)


  function handleClickedMovieCard(id){
    setSelectedMovieId(id)
  }
  
  function handleOnClose(){
    setSelectedMovieId()
  }

  function handleNextPage(){
    setPageNumber(prevState => prevState + 1)
  }

  function handlePreviousPage(){
    setPageNumber(prevState => prevState - 1)
  }

  function handleNavBars() {
    setSelectedNavIcon(prevState => !prevState)
  }

  function handleOnChange(event){
    setSearchedMovies(() => {
      let searchValue = event.target.value
      let newSearchValue = ""
  
      for (let i = 0; i < searchValue.length; i++) {
        const element = searchValue[i];
      
        if(element === " "){
          newSearchValue = newSearchValue + "%20"
        }
        else{
          newSearchValue = newSearchValue + element
        }
        
      }
  
      return newSearchValue
  
    })
  }
  
  let selectedMovieData = movies.find(item => item.id === selectedMovieId)




  const movieCardElements = movies.map(item => {
    return (
      <div key={item.id} id ={item.id} className='movie-card' onClick={() => handleClickedMovieCard(item.id)}>
        <img src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} />
        <h3>{item.title} ({item.release_date.substring(0,4)})</h3>
      </div>)
    }
  )

  return (
    <div>

      <menu className="menu">

        <h2>Movie<span>Planet</span></h2>

        <div className='search-bar-div'>
          <input type='text' name='search-bar' id='search-bar' onChange={handleOnChange} />
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
        </div>

        <ul className={!selectedNavIcon ? "list-invisible": "list-visible"}>

          <li><a className={selectedMovieGenre==="Newest" ? "activeLink" : ""} onClick={() => handleOnclick("Newest")}>Newest</a></li>
          <li><a className={selectedMovieGenre==="Action" ? "activeLink" : ""} onClick={() => handleOnclick("Action")}>Action</a></li>
          <li><a className={selectedMovieGenre==="Drama" ? "activeLink" : ""} onClick={() => handleOnclick("Drama")}>Drama</a></li>
          <li><a className={selectedMovieGenre==="Adventure" ? "activeLink" : ""} onClick={() => handleOnclick("Adventure")}>Adventure</a></li>
          <li><a className={selectedMovieGenre==="Sci-fi" ? "activeLink" : ""} onClick={() => handleOnclick("Sci-fi")}>Sci-fi</a></li>
          <li><a className={selectedMovieGenre==="Horror" ? "activeLink" : ""} onClick={() => handleOnclick("Horror")}>Horror</a></li>

        </ul>

        <i className={!selectedNavIcon ? "fa-solid fa-bars list-icon": "fa-solid fa-x list-icon"} onClick={handleNavBars}></i>

      </menu>

      <main>

        <h1>{searchedMovies ? "Searched": selectedMovieGenre} movies</h1>

        <div className='container'>

          {movieCardElements}

          {selectedMovieId && 
          <div className='background-selected-movie'>
            <div className='selected-movie'>
              <div className="selected-movie-content">
                      <div className="header-div">
                          <h2>{selectedMovieData.title} ({selectedMovieData.release_date.substring(0,4)})</h2>
                      </div>
                      <p><span>Rating:</span> {selectedMovieData.vote_average} <i className="fa-solid fa-star yellow"></i></p>
                      <p><span>Runtime:</span> {movieInfo && movieInfo.runtime} min</p>
                      <p><span>Stars:</span> {movieInfo && `${movieInfo.credits.cast[0].name}, ${movieInfo.credits.cast[1].name}, ${movieInfo.credits.cast[2].name}`}</p>
                      <p className="span"><span>Storyline:</span> {selectedMovieData.overview}</p>

                    </div>

                    <div className="selected-movie-video">

                        <iframe width="100%" height="100%" src={movieInfo && `https://www.youtube.com/embed/${movieInfo.videos.results[0].key}`} allowFullScreen></iframe>

                    </div>

                    <img 
                        className="close-img"
                        src="https://cdn.pixabay.com/photo/2016/10/10/01/49/x-1727490_960_720.png" 
                        alt="close icon" 
                        onClick={handleOnClose} 
                    />
            </div>
          </div>
          }

        </div>

        <div className="show-cards-button">
          {pageNumber > 1 && <button onClick={handlePreviousPage}>Previous Page</button>}
          <button onClick={handleNextPage}>Next Page</button>
        </div>
      </main>

    </div>
  );
}

