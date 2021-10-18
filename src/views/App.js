import { BrowserRouter as Router, Route } from "react-router-dom";
import Profile from "./profile/Profile";
import About from "./about/About";
import MapView from "./../views/map/MapView";
//import Button from './../components/buttons/Button';
import NavBar from "./../components/nav/NavBar";

import "./App.css";

function RouterComponent() {
  return (
    <Router>
      <NavBar />
      <Route path="/" exact render={() => <MapView />} />
      <Route path="/map" exact render={() => <MapView />} />
      {/*
        Toistaiseksi piiloon
      <Route path="/about" exact render={() => <About />} />
      <Route path="/profile" exact render={() => <Profile />} />*/}
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
