import React, { Component } from 'react';

import { Avatar, Button, Menu, MenuItem, Divider, Grid, Drawer } from '@material-ui/core';
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
            drawerOpen: false,
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
            <header style={{ marginBottom: 0 }}>
                <Grid container>
                    <Grid item md={10} xs={8} >
                        { this.props.title }
                    </Grid>
                    <Grid item md={2} xs={4} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                        <div>
                            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick} className="config-step">
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
                                <MenuItem onClick={ e => this.setState({anchorEl: null, drawerOpen: true}) }><IoMdOptions size={20} style={{ marginRight: 10 }} /> Configuración</MenuItem>
                                <Divider style={{ width: '100%', marginTop: 5, marginBottom: 5 }} />
                                <MenuItem onClick={this.logout}><IoMdPower size={20} style={{ marginRight: 10 }} /> Salir</MenuItem>
                            </Menu>
                        </div>

                        <Drawer anchor='right' open={ this.state.drawerOpen } onClose={(e) => this.setState({drawerOpen: false}) }>
                            <div style={{width: 300}}>
                                {/* Panel de configuración */}
                            </div>
                        </Drawer>
                    </Grid> 
                </Grid>
            </header>
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