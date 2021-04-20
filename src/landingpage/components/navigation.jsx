import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Link as LinkScroll } from "react-scroll";
import { Grid, Button } from "@material-ui/core";

import { IoIosLogIn } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";

import { env } from '../../env';

const { color } = env;


export class Navigation extends Component {
  render() {
    return (
      <nav id="menu" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              {" "}
              <span className="sr-only">Toggle navigation</span>{" "}
              <span className="icon-bar"></span>{" "}
              <span className="icon-bar"></span>{" "}
              <span className="icon-bar"></span>{" "}
            </button>
            <LinkScroll
              to="page-top"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="navbar-brand page-scroll"
            >
              <Grid container>
                <Grid item xs={4}>
                  <img src="favicon.ico" alt="gerente.rest_logo" style={{ width: 50, float: 'left', marginTop: -5 }}/>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ paddingTop: 10,}}>
                    <span style={{fontSize: 20}}>gerente.rest</span>
                  </div>
                </Grid>
              </Grid>
            </LinkScroll>
          </div>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right">
              <li>
                <LinkScroll
                  activeClass="nav-active"
                  to="features"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="page-scroll"
                >
                  Caracteriticas
                </LinkScroll>
              </li>
              <li>
                <LinkScroll
                  activeClass="nav-active"
                  to="services"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="page-scroll"
                >
                  Servicios
                </LinkScroll>
              </li>
              <li>
                <LinkScroll
                  activeClass="nav-active"
                  to="portfolio"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="page-scroll"
                >
                  Galeria
                </LinkScroll>
              </li>
              <li>
                <LinkScroll
                  activeClass="nav-active"
                  to="testimonials"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="page-scroll"
                >
                  Testimonio
                </LinkScroll>
              </li>
              <li>
                <LinkScroll
                  activeClass="nav-active"
                  to="about"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="page-scroll"
                >
                  Acerca de
                </LinkScroll>
              </li>
              <Link to="/login">
                <Button
                
                  variant="contained"
                  endIcon={<IoIosLogIn />}
                  style={{ backgroundColor: color.primary, border: `1px solid ${color.primary}`, color: 'white', marginTop: 10, textTransform: 'capitalize', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4}}
                >
                  <small style={{fontSize: 12}}>Ingreso</small>
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="contained"
                  endIcon={<FaUserEdit />}
                  style={{ backgroundColor: 'white', border: `1px solid ${color.primary}`, color: color.primary, marginTop: 10, marginLeft: 10, textTransform: 'capitalize', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4}}
                >
                  <small style={{fontSize: 12}}>Registro</small>
                </Button>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;
