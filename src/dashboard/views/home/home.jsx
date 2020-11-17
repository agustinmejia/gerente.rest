import React, { Component } from 'react';

import { IoIosMenu } from "react-icons/io";

// Components
import Sidebar from "../../components/sidebar/sidebar";

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            sidebarToggled: false
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