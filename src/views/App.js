import { BrowserRouter as Router, Route } from "react-router-dom";
import MapView from "./../views/map/MapView";
import TimetableView from "./../views/timetable/Timetable";
import NavBar from "./../components/nav/NavBar";
import { Localization } from "../utils/i18n-helper";

import { connect } from "react-redux";
import "./App.css";

function RouterComponent() {
  return (
    <Router>
      <NavBar />
      <Route path="/" exact render={() => <MapView />} />
      <Route path="/map" exact render={() => <MapView />} />
      <Route path="/timetable" exact render={() => <TimetableView />} />
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
      <h2>{Localization('Welcome to React')}</h2>
      <RouterComponent></RouterComponent>
    </div>
  );
}


function mapStateToProps(state) {
  return {
    language: state.language
  };
}

export default connect(mapStateToProps)(App);

//export default App;
