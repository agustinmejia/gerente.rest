import React, { Component } from "react";
import { Link as LinkScroll } from "react-scroll";

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
              <div style={{ width: '30%' }}>
                <img src="favicon.ico" alt="gerente.rest_logo" style={{ width: 40, float: 'left', marginTop: -5 }}/>
              </div>
              <div style={{ width: '70%', marginTop: 5 }}>
                <span style={{ paddingLeft: 10,}}>gerente.rest</span>
              </div>
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
                  to="contact"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="page-scroll"
                >
                  Contacto
                </LinkScroll>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;
