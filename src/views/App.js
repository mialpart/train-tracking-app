import { BrowserRouter as Router, Route } from "react-router-dom";
import Profile from "./profile/Profile";
import About from "./about/About";
import MapComponent from "./../components/map/MapComponent";
//import Button from './../components/buttons/Button';
import NavBar from "./../components/nav/NavBar";

import "./App.css";

function RouterComponent() {
  return (
    <Router>
      <NavBar />
      <Route path="/" exact render={() => <Profile />} />
      <Route path="/home" exact render={() => <MapComponent />} />
      <Route path="/about" exact render={() => <About />} />
      <Route path="/profile" exact render={() => <Profile />} />
    </Router>
  );
}

function App() {
  return (
    <div className="App">
      <RouterComponent></RouterComponent>
      <h1>FOOTER</h1>
    </div>
  );
}

export default App;
