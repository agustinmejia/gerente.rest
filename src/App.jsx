import React, { Component } from 'react'
import { CircularProgress } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

// LandingPage
import Index from "./landingpage/views/index";

// Admin
import Login from "./dashboard/views/auth/login/login";
import Register from "./dashboard/views/auth/register/register";
import Home from "./dashboard/views/home/home";
import MyCompany from "./dashboard/views/mycompany/mycompany";
// Branches
import BranchesList from "./dashboard/views/branches/branchesList";
import BranchesCreateEdit from "./dashboard/views/branches/branchesCreateEdit";

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
import Receipt from "./dashboard/views/sales/print/receipt";
import Tickets from "./dashboard/views/tickets/tickets";

// Employes
import EmployesList from "./dashboard/views/employes/employesList";
import EmployesCreateEdit from "./dashboard/views/employes/EmployesCreateEdit";

// Reports
import SalesReports from "./dashboard/views/reports/sales";

// Config
import Profile from "./dashboard/views/config/profile";

// Pages default
import Error404 from "./dashboard/views/errors/404";

import JsonData from './landingpage/data/data.json';

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
            <GuardedRoute exact path="/" meta={{ routeLogin: true }} render={(props) => <Index data={ this.state.landingPageData } {...props}/>} />

            {/* Dashboard */}

            {/* Auth */}
            <GuardedRoute exact path="/login" meta={{ auth: true, routeLogin: true }} render={(props) => <Login {...props}/>} />
            <GuardedRoute exact path="/register" meta={{ routeLogin: true }} render={(props) => <Register {...props}/>} />

            {/* Dashboard */}
            <GuardedRoute exact path="/dashboard" meta={{ auth: true }} render={(props) => <Home {...props}/>} />

            {/* Dashboard */}
            <GuardedRoute exact path="/dashboard/mycompany" meta={{ auth: true }} render={(props) => <MyCompany {...props}/>} />

            <GuardedRoute exact path="/dashboard/branches" meta={{ auth: true }} render={(props) => <BranchesList {...props}/>} />
            <GuardedRoute exact path="/dashboard/branches/create" meta={{ auth: true }} render={(props) => <BranchesCreateEdit {...props}/>} />
            <GuardedRoute exact path="/dashboard/branches/:id/edit" meta={{ auth: true }} render={(props) => <BranchesCreateEdit {...props}/>} />

            <GuardedRoute exact path="/dashboard/products" meta={{ auth: true }} render={(props) => <ProductsList {...props}/>} />
            <GuardedRoute exact path="/dashboard/products/create" meta={{ auth: true }} render={(props) => <ProductsCreateEdit {...props}/>} />
            <GuardedRoute exact path="/dashboard/products/:id/edit" meta={{ auth: true }} render={(props) => <ProductsCreateEdit {...props}/>} />

            <GuardedRoute exact path="/dashboard/cashiers" meta={{ auth: true }} render={(props) => <CashiersList {...props}/>} />
            <GuardedRoute exact path="/dashboard/cashiers/:id/close" meta={{ auth: true }} render={(props) => <CashiersClose {...props}/>} />

            <GuardedRoute exact path="/dashboard/sales" meta={{ auth: true }} render={(props) => <SalesList {...props}/>} />
            <GuardedRoute exact path="/dashboard/kitchen" meta={{ auth: true }} render={(props) => <SalesKitchenList {...props}/>} />
            <GuardedRoute exact path="/dashboard/sales/create" meta={{ auth: true }} render={(props) => <SalesCreate {...props}/>} />
            <GuardedRoute exact path="/dashboard/sales/print/:id" meta={{ auth: true }} render={(props) => <Receipt {...props}/>} />
            <GuardedRoute exact path="/dashboard/tickets" meta={{ auth: true }} render={(props) => <Tickets {...props}/>} />

            <GuardedRoute exact path="/dashboard/employes" meta={{ auth: true }} render={(props) => <EmployesList {...props}/>} />
            <GuardedRoute exact path="/dashboard/employes/create" meta={{ auth: true }} render={(props) => <EmployesCreateEdit {...props}/>} />
            <GuardedRoute exact path="/dashboard/employes/:id/edit" meta={{ auth: true }} render={(props) => <EmployesCreateEdit {...props}/>} />

            <GuardedRoute exact path="/dashboard/reports/sales" meta={{ auth: true }} render={(props) => <SalesReports {...props}/>} />

            <GuardedRoute exact path="/dashboard/profile" meta={{ auth: true }} render={(props) => <Profile {...props}/>} />

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