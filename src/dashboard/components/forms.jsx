import React from 'react';
import {
    Grid,
    TextField,
    Button,
    Typography
}from '@material-ui/core';
import { Link } from "react-router-dom";
import { IoIosCheckmarkCircle, IoIosArrowDropleft } from "react-icons/io";
import { AiOutlineMinusCircle } from "react-icons/ai";

import { env } from '../../config/env';

const { color } = env;


export const TextFieldCustom = (props) => {
    return(
        <Grid item xs={ props.xs ? props.xs : 12 }>
            <TextField
                autoFocus={ props.autoFocus }
                variant="outlined"
                required={ props.required }
                fullWidth
                id={ `input-${props.name}` }
                label={ props.label }
                helperText={ props.helperText }
                name={ props.name }
                value={ props.value }
                onChange={ props.onChange }
            />
        </Grid>
    )
}

export const FormButtons = (props) => {
    return(
        <div style={{ paddingTop: 100 }}>
            <Grid container spacing={2} direction="row" justify="flex-end" style={{position: 'fixed', bottom: 0, right: 0, backgroundColor: 'white', padding: 20, zIndex: 10}}>
                <Grid item xs={4} sm={3}>
                    <Link to={ props.back }>
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            startIcon={ <IoIosArrowDropleft/> }
                        >
                            Volver
                        </Button>
                    </Link>
                </Grid>
                <Grid item xs={4} sm={3}>
                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        endIcon={ <IoIosCheckmarkCircle/> }
                    >
                    { props.titleSuccess }
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export const ListEmpty = props => {
    return(
        <Grid container direction="column" justify="center" alignItems="center" style={{padding: 40}}>
            <AiOutlineMinusCircle size={150} color={`rgba(${color.primaryAlt},0.6)`} />
            <Typography variant="h4" style={{color: 'rgba(0,0,0,0.5)'}}>Lista vacía</Typography>
            <Typography variant="body2" style={{color: 'rgba(0,0,0,0.5)'}}>Para agregar un nuevo registro presiona el botón de la parte superior derecha.</Typography>
        </Grid>
        
    );
}