import './App.css';
import Form from './components/Form/Form';
import Home from './components/Home/Home';
import Admin from './components/Admin/Admin';
import { BrowserRouter, Route } from 'react-router-dom';
import User from './components/User/User';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Form />
        </Route>
        <Route exact path="/admin">
          <Admin />
        </Route>
        <Route exact path="/user">
          <User />
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
