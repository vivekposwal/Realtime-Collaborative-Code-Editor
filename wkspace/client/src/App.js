import { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
//import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import WorkspacePage from "./pages/WorkspacePage";
import IndexPage from "./pages/IndexPage";
import SharePage from "./pages/SharePage";
import landingPage from "./pages/landingPage";
import "./App.css";

class App extends Component {
  render() {
    const navbarHeight = "56px";
    return (
      <Router>
        <>
          <div
            style={{ height: `calc(100% - ${navbarHeight})`, overflow: "none" }}
          >
            <Switch>
              <Route exact path="/" component={landingPage} />
              <Route exact path="/index" component={IndexPage} />
              <Route exact path="/workspace" component={WorkspacePage} />
              <Route exact path="/workspace/:id" component={WorkspacePage} />
              <Route exact path="/share/:id" component={SharePage} />
              <Redirect to="/" />
            </Switch>
          </div>
        </>
      </Router>
    );
  }
}

export default App;
