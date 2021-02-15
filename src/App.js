import React, {useState, useEffect} from 'react'
import logo from './logo.svg';
import './App.css';

const ALLCATEGORIESURL = 'https://api.chucknorris.io/jokes/categories'
const RANDOMJOKEBYCATURL = 'https://api.chucknorris.io/jokes/random?category=' // remember to fill this
const ALLLJOKESBYKEYWORD = 'https://api.chucknorris.io/jokes/search?query=' // remember to fill this
const launchErrorAlert = () => setTimeout(() => window.alert('errore!'), 500) 

// classe 'App-logo-spinning' durante il caricamento, altrimenti classe 'App-logo'
const Logo = ({loading }) => {
  return (
    <img
      src={logo}
      alt='interactive-logo'
      className={`App-logo${loading ? '-spinning' : ''}`}
    />
  )
}

const Joke = ({value,categories}) => {
  return (
  <div className="Joke">
      <code className="Joke-Value">{value}</code>
      <p> categories: 
        {categories.map((category, index) =>
          <span className="Selected-Cat" key={`cat-${index}`}>
             <code>{category}</code>
          </span>)}
      </p>
  </div> 
)}


function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError]=useState(false)
  const [inputValue, setInputValue] = useState("");
  const [currentJoke, setCurrentJoke] = useState({});

  
  // qui tutto ciò che serve al componente per essere inizializzato

  // getJokeByKeyword
  // funzione che recupera le barzellette contenenti la parola chiave
  // digitata nel campo di testo
  const getJokeByKeyword = async () => {
    let currentJoke={}
    let error = false

    try {
      setLoading(true)

      const response = await fetch(`${ALLLJOKESBYKEYWORD}${inputValue}`)
      const data = await response.json()

      console.log("DATA:", data)

      if(data && data.status) throw new Error("invalid keyword")
      if (data && data.result.length === 0) throw new Error("no result")

      currentJoke = {...data.result[0]}
      
    } catch (err) {
      error=true
      console.log("ECCOMI:", err)
      
    } finally { 
        setLoading(false)  
        setCurrentJoke(currentJoke)
        setError(error)
    } 
  }

  // onInputTextChange
  const onInputTextChange = (event) => {
    setInputValue(event.target.value)
  }

  // qui i lifecycle methods
  useEffect(() => {
    if (error) launchErrorAlert()}, [error])


  // render () {
    return (
      <div className="App">
        <div className="App-header">
          <Logo loading={loading}
          />
          <input
            type="search"
            id="search" 
            name="search"
            placeholder="Enter keyword here"
            onChange={onInputTextChange}
            value={inputValue}
          />
          <button
            className="Search-Button"
            onClick={getJokeByKeyword}
            disabled={loading}
          >
            <code>CLICK TO SEARCH!</code>
          </button>
        </div>
        <div className="Content">
          <img
            src="https://api.chucknorris.io/img/chucknorris_logo_coloured_small@2x.png" 
            className="Chuck-Logo"
            alt="chuck-logo"
          />
          {Object.keys(currentJoke).length > 0 && <Joke {...currentJoke} />}
        </div>
        <div className="footer">
        <code>Esame di React per cfp-futura. Grazie ad <a href="https://api.chucknorris.io">api.chucknorris.io</a> per l'immagine e le api. Docente: Vito Vitale. Studente: Mariella Renzelli </code>
        </div>
      </div>
    );

};

export default App;