import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';


const formNames = [
  'Movie Title',
  'Release Date',
  'Movie Rating',
  'Genre',
  'Studio Email',
]

const fieldModifiers = {
  release_date: {
    type: 'date',
    formatter: (n) => {
      return (new Date(n)).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
  genre: {
    options: ['Action', 'Animation', 'Comedy', 'Drama', 'Historical', 'Horror','Sci Fi'],
  },
  studio_email: {
    validator: (n) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/.test(n),
    alert: 'Please enter a valid email address!',
  },
  movie_rating: {
    validator: (n) => {
      const value = parseFloat(n);
      return !isNaN(value) && value > 0 && value < 10;
    },
    formatter: (n) => +n.toFixed(1),
    alert: 'Please enter a value for Movie Rating between 0 and 10!'
  },
};

const formFields = formNames.map(label => ({
  label,
  name: toSnake(label),
}));

function App() {
  const [movies, setMovies] = useState([]);
  const addMovie = (newMovie) => {
    setMovies([...movies, newMovie]);
  };

  return (
    <div className="App">
      <MovieForm
        addMovie={addMovie}
        fields={formFields}
      />
      <hr/>
      <SavedMovies
        movies={movies}
      />
    </div>
  );
}

function MovieForm({fields, addMovie}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const newMovie = formToObject(e.target);
    const isValid = validateAndNotify(newMovie);
    if (!isValid) {
      console.log('fail!')
      return;
    }
    addMovie(newMovie);
  };

  return (
    <div className="movie-form" onSubmit={ handleSubmit }>
      <form>
        {fields.map(({ label, name }) => {
          const mod = fieldModifiers[name];
          return (
            <label key={name}>
              {label}
              {mod && mod.options ?
                <select name={name}>
                  {mod.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select> :
                <input type={mod && mod.type || "text"} name={name}/>
              }
            </label>
          );
        })}
        <label>
          <input type="submit" value="Save"></input>
        </label>
      </form>
    </div>

  );
}

function SavedMovies({ movies }) {
  return (
    <div className="saved-movies">
      <div className="row heading">
        {!!movies.length && formNames.map((name) => (
          <div key={name}>
            {name.replace('Movie','')}
          </div>
        ))}
      </div>
      {movies.map((movieData) => (
        <div className="row">
          {Object.keys(movieData).map(key => {
            const mod = fieldModifiers[key];
            return (
              <div key={key}>
                {mod && mod.formatter ? mod.formatter(movieData[key]) : movieData[key]}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function validateAndNotify(movie, fn = alert, _mod = fieldModifiers) {
  const msg = 'Please fill out all fields before submitting!';
  if (!Object.values(movie).every(n => n !== '')) {
    fn(msg);
    return false;
  }

  return Object.keys(movie).every(field => {
    // Make the field isn't blank.
    if (movie[field] === '') {
      fn(msg);
      return false;
    }
    // If there's no validator, just return true.
    if (!_mod[field] || !_mod[field].validator) {
      return true;
    }
    // If there's a validator, use the alert message or the default.
    if (!_mod[field].validator(movie[field])) {
      console.log('what?')
      fn(_mod[field].alert || msg);
      return false;
    }
    return true;
  });
}

function formToObject(form) {
  const formData = new FormData(form);
  const newMovie = {};
  formData.forEach((v, k) => newMovie[k] = v);
  return newMovie;
}

function toSnake(text) {
  return text.toLowerCase().replace(' ','_');
}

export default App;
