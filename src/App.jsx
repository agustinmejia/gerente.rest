import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// Components
import Navigation from './components/landingpage/navigation';
import Header from './components/landingpage/header';
import Features from './components/landingpage/features';
import About from './components/landingpage/about';
import Services from './components/landingpage/services';
import Gallery from './components/landingpage/gallery';
import Testimonials from './components/landingpage/testimonials';
import Contact from './components/landingpage/contact';
import JsonData from './data/data.json';

// Admin
import Home from "./dashboard/views/home/home";

export class App extends Component {
  state = {
    landingPageData: {},
  }
  getlandingPageData() {
    this.setState({landingPageData : JsonData})
  }

  componentDidMount() {
    this.getlandingPageData();
  }

  render() {
    return (
      <Router>
        <Switch>
        {/* LandingPage */}
          <Route exact path="/">
            <Navigation />
            <Header data={this.state.landingPageData.Header} />
            <Features data={this.state.landingPageData.Features} />
            <About data={this.state.landingPageData.About} />
            <Services data={this.state.landingPageData.Services} />
            <Gallery />
            <Testimonials data={this.state.landingPageData.Testimonials} />
            <Contact data={this.state.landingPageData.Contact} />
          </Route>

          {/* Dashboard */}
          <Route exact path="/dashboard">
            <Home />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
