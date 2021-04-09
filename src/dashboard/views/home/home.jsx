import React, { Component } from 'react';
import { IoIosMenu } from "react-icons/io";

import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';

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

    componentDidMount(){
        // let { user } = this.props.authSession;
    }

    render() {
        return (
            <div className='app'>
                <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
                <main style={{paddingTop: 10}}>
                    <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                        <IoIosMenu size={40} />
                    </div>

                    <Navbar title={<h1 style={{marginLeft: 20}}> Bienvenido</h1>} />

                </main>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(Home));