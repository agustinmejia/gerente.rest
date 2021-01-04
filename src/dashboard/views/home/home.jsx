import React, { Component } from 'react';
import { IoIosMenu } from "react-icons/io";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            sidebarToggled: false,
        }
    }

    render() {
        return (
            <div className='app'>
                <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
                <main>
                    <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                        <IoIosMenu size={40} />
                    </div>
                    <Navbar/>
                    <header style={{ paddingLeft: 30 }}>
                        <h1>Bienvenido</h1>
                    </header>
                </main>
            </div>
        );
    }
}

export default Home;