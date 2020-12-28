import React, { Component } from 'react'
import { CircularProgress } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { GuardProvider, GuardedRoute } from 'react-router-guards';

// Components
import Navigation from './landingpage/components/navigation';
import Header from './landingpage/components/header';
import Features from './landingpage/components/features';
import About from './landingpage/components/about';
import Services from './landingpage/components/services';
import Gallery from './landingpage/components/gallery';
import Testimonials from './landingpage/components/testimonials';
import Contact from './landingpage/components/contact';
import JsonData from './landingpage/data/data.json';

// Admin
import Login from "./dashboard/views/auth/login/login";
import Register from "./dashboard/views/auth/register/register";
import Home from "./dashboard/views/home/home";
import MyCompany from "./dashboard/views/mycompany/mycompany";

import Error404 from "./dashboard/views/errors/404";

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Loading = () => {
  return(
    <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
      <CircularProgress/>
    </div>
  );
}

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      landingPageData: {},
    }
  }

  async getAuthLogin(){
    try {
      const sessionAuthSession = await AsyncStorage.getItem('sessionAuthSession');
      let authSession = sessionAuthSession ? JSON.parse(sessionAuthSession) : {};
      this.props.setAuthSession(authSession);
      // return authSession;
    } catch (e) {
      console.log(e)
    }
  }

  componentDidMount() {
    this.getlandingPageData();
    this.loadGlobalConfig();
  }

  async loadGlobalConfig(){
    const sessionGlobalConfig = await AsyncStorage.getItem('sessionGlobalConfig');
    let globalConfig = sessionGlobalConfig ? JSON.parse(sessionGlobalConfig) : this.props.globalConfig;
    this.props.setGlobalConfig(globalConfig);
  }

  requireLogin = async (to, from, next) => {
    await this.getAuthLogin();
    if (to.meta.auth) {
      if (this.props.authSession.user) {
        if (to.meta.routeLogin) {
          next.redirect('/dashboard');
        }
        next();
      }
      next.redirect('/login');
    } else {
      next();
    }
  };

  getlandingPageData() {
    this.setState({landingPageData : JsonData})
  }

  render() {
    return (
      <Router>
        <GuardProvider guards={[this.requireLogin]} loading={Loading} error={Error404}>
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
            
            {/* Login */}
            <GuardedRoute exact path="/login" meta={{ auth: true, routeLogin: true }}>
              <Login />
            </GuardedRoute>
            {/* Register */}
            <GuardedRoute exact path="/register" meta={{ routeLogin: true }}>
              <Register />
            </GuardedRoute>
            {/* Dashboard */}
            <GuardedRoute exact path="/dashboard" meta={{ auth: true }}>
              <Home />
            </GuardedRoute>
            {/* Dashboard */}
            <GuardedRoute exact path="/dashboard/mycompany" meta={{ auth: true }}>
              <MyCompany />
            </GuardedRoute>

            {/* Not found */}
            <Route path="*" component={Error404} />
          </Switch>
        </GuardProvider>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authSession: state.authSession,
    globalConfig: state.globalConfig,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthSession : (authSession) => dispatch({
      type: 'SET_AUTH_SESSION',
      payload: authSession
    }),
    setGlobalConfig : (globalConfig) => dispatch({
      type: 'SET_GLOBAL_CONFIG',
      payload: globalConfig
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);