import React, { Component } from 'react';

import { Avatar, Button, Menu, MenuItem, Divider } from '@material-ui/core';
import { IoMdArrowDropdown, IoMdPerson, IoMdOptions, IoMdPower } from "react-icons/io";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import { env } from '../../../config/env'

const URL = env.API;

class Navbar extends Component {
    constructor(props){
        super(props)
        this.state = {
            sidebarToggled: false,
            anchorEl: null,
            logout: false
        }
    }

    handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    logout = async () =>{
        try {
            await AsyncStorage.setItem('sessionAuthSession', '{}');
            this.props.setAuthSession({});
            // return authSession;
            this.setState({logout: true});
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        if(this.state.logout){
            return <Redirect to='/login' />
        }

        return (
            <div className="top-bar" style={{ zIndex: 1 }}>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                    { this.props.authSession.user &&
                        <>
                            <Avatar alt="User" src={this.props.authSession.user.avatar.search('https') ? `${URL}/storage/${this.props.authSession.user.avatar}` : this.props.authSession.user.avatar} /> <IoMdArrowDropdown size={15} />
                        </>
                    }
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose}><IoMdPerson size={20} style={{ marginRight: 10 }} /> Perfil</MenuItem>
                    <MenuItem onClick={this.handleClose}><IoMdOptions size={20} style={{ marginRight: 10 }} /> Configuración</MenuItem>
                    <Divider style={{ width: '100%', marginTop: 5, marginBottom: 5 }} />
                    <MenuItem onClick={this.logout}><IoMdPower size={20} style={{ marginRight: 10 }} /> Salir</MenuItem>
                </Menu>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
  return {
    authSession: state.authSession,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthSession : (authSession) => dispatch({
        type: 'SET_AUTH_SESSION',
        payload: authSession
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);