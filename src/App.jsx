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
// Branches
import BranchesList from "./dashboard/views/branches/branchesList";
import BranchesCreate from "./dashboard/views/branches/branchesCreate";
import BranchesEdit from "./dashboard/views/branches/branchesEdit";

// Products
import ProductsList from "./dashboard/views/products/productsList";
import ProductsCreateEdit from "./dashboard/views/products/productsCreateEdit";

// Cashiers
import CashiersList from "./dashboard/views/cashiers/cashiersList";
import CashiersClose from "./dashboard/views/cashiers/cashiersClose";

// Sales
import SalesList from "./dashboard/views/sales/salesList";
import SalesKitchenList from "./dashboard/views/sales/salesKitchenList";
import SalesCreate from "./dashboard/views/sales/salesCreate";

// Employes
import EmployesList from "./dashboard/views/employes/employesList";
import EmployesCreateEdit from "./dashboard/views/employes/EmployesCreateEdit";

// Tickets
import Tickets from "./dashboard/views/tickets/tickets";

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

            {/* Auth */}
            <GuardedRoute exact path="/login" meta={{ auth: true, routeLogin: true }} render={(props) => <Login {...props}/>} />
            <GuardedRoute exact path="/register" meta={{ routeLogin: true }} render={(props) => <Register {...props}/>} />

            {/* Dashboard */}
            <GuardedRoute exact path="/dashboard" meta={{ auth: true }} render={(props) => <Home {...props}/>} />

            {/* Dashboard */}
            <GuardedRoute exact path="/dashboard/mycompany" meta={{ auth: true }} render={(props) => <MyCompany {...props}/>} />

            <GuardedRoute exact path="/dashboard/branches" meta={{ auth: true }} render={(props) => <BranchesList {...props}/>} />
            <GuardedRoute exact path="/dashboard/branches/create" meta={{ auth: true }} render={(props) => <BranchesCreate {...props}/>} />
            <GuardedRoute exact path="/dashboard/branches/:id/edit" meta={{ auth: true }} render={(props) => <BranchesEdit {...props}/>} />

            <GuardedRoute exact path="/dashboard/products" meta={{ auth: true }} render={(props) => <ProductsList {...props}/>} />
            <GuardedRoute exact path="/dashboard/products/create" meta={{ auth: true }} render={(props) => <ProductsCreateEdit {...props}/>} />
            <GuardedRoute exact path="/dashboard/products/:id/edit" meta={{ auth: true }} render={(props) => <ProductsCreateEdit {...props}/>} />

            <GuardedRoute exact path="/dashboard/cashiers" meta={{ auth: true }} render={(props) => <CashiersList {...props}/>} />
            <GuardedRoute exact path="/dashboard/cashiers/:id/close" meta={{ auth: true }} render={(props) => <CashiersClose {...props}/>} />

            <GuardedRoute exact path="/dashboard/sales" meta={{ auth: true }} render={(props) => <SalesList {...props}/>} />
            <GuardedRoute exact path="/dashboard/kitchen" meta={{ auth: true }} render={(props) => <SalesKitchenList {...props}/>} />
            <GuardedRoute exact path="/dashboard/sales/create" meta={{ auth: true }} render={(props) => <SalesCreate {...props}/>} />

            <GuardedRoute exact path="/dashboard/employes" meta={{ auth: true }} render={(props) => <EmployesList {...props}/>} />
            <GuardedRoute exact path="/dashboard/employes/create" meta={{ auth: true }} render={(props) => <EmployesCreateEdit {...props}/>} />
            <GuardedRoute exact path="/dashboard/employes/:id/edit" meta={{ auth: true }} render={(props) => <EmployesCreateEdit {...props}/>} />

            <GuardedRoute exact path="/dashboard/tickets" meta={{ auth: true }} render={(props) => <Tickets {...props}/>} />

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