import logo from './logo.svg';
import './App.css';

const formFields = [
  'Movie Title',
  'Release Data',
  'Movie Rating',
  'Genre',
  'Studio Email',
].map(label => ({
  label,
  name: toSnake(label),
}));

function App() {
  return (
    <div className="App">
      <MovieForm
        fields={formFields}
      />
    </div>
  );
}

function MovieForm({fields}) {
  console.log(fields);
  return (
    <div className="Form">
      <form>
        {fields.map(({ label, name }) => (
          <label key={name}>
            {label}
            <input type="text" name={name}/>
          </label>
        ))}
        <label>
          <input type="submit" value="Save"></input>
        </label>
      </form>
    </div>

  );
}

function toSnake(text) {
  return text.toLowerCase().replace(' ','_');
}

export default App;
