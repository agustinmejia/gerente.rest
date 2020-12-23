import React, { Component } from 'react';
import {
    Container, Typography
}from '@material-ui/core';
import { Link } from "react-router-dom";

class Error404 extends Component {
    // constructor(props){
    //     super(props);

    // }

    render(){
        return(
            <>
                <Container maxWidth="sm" style={{ marginTop: 150, textAlign: 'center', }}>
                    <Typography style={{ fontSize: 100 }}>404</Typography>
                    <Typography variant='h3'>Página no encontrada</Typography>
                    <div style={{ marginTop: 20 }}>
                        <Link to="/" variant="body2">
                            Volver al inicio
                        </Link>
                    </div>
                </Container>
            </>
        );
    }
}

export default Error404;