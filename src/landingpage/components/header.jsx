import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

export class Header extends Component {
  render() {
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 intro-text">
                  <h1>
                    {this.props.data ? this.props.data.title : "Loading"}
                    <span></span>
                  </h1>
                  <p>
                    {this.props.data ? this.props.data.paragraph : "Loading"}
                  </p>
                  { this.props.authSession.user && <Link to="/dashboard" className="btn btn-custom btn-lg">Ir al panel! </Link> }
                  { !this.props.authSession.user && <Link to="/register" className="btn btn-custom btn-lg">Registrate ahora!</Link> }
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
const mapStateToProps = (state) => {
    return {
        authSession: state.authSession
    }
}

export default connect(mapStateToProps)(Header);
