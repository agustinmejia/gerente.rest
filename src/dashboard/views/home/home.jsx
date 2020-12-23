import React, { Component } from 'react';

import { Avatar, Button, Menu, MenuItem, Divider } from '@material-ui/core';
import { IoIosMenu, IoMdArrowDropdown, IoMdPerson, IoMdOptions, IoMdPower } from "react-icons/io";

// Components
import Sidebar from "../../components/sidebar/sidebar";

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            sidebarToggled: false,
            anchorEl: null
        }
    }

    handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };


    render() {
        return (
            <div className='app'>
                <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
                <main>
                    <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                        <IoIosMenu size={40} />
                    </div>
                    <div className="top-bar">
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                            <Avatar alt="User" src="https://material-ui.com/static/images/avatar/1.jpg" /> <IoMdArrowDropdown size={15} />
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
                            <MenuItem onClick={this.handleClose}><IoMdPower size={20} style={{ marginRight: 10 }} /> Salir</MenuItem>
                        </Menu>

                    </div>
                    <header style={{ paddingLeft: 30 }}>
                        <h2>
                            Bienvenido
                        </h2>
                    </header>
                </main>
            </div>
        );
    }
}

export default Home;