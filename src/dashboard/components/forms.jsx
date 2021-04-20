import React from 'react';
import {
    Grid,
    TextField,
    Button,
    Typography,
    CircularProgress
}from '@material-ui/core';
import { Link } from "react-router-dom";
import { IoIosCheckmarkCircle, IoIosArrowDropleft } from "react-icons/io";
import { AiOutlineMinusCircle } from "react-icons/ai";

import { env } from '../../env';

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
                inputProps={ props.inputProps }
            />
        </Grid>
    )
}

export const FormButtons = (props) => {
    return(
        <div style={{ paddingTop: 80 }}>
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
                        style={{ backgroundColor: color.primary, color: 'white'}}
                        endIcon={ <IoIosCheckmarkCircle/> }
                    >
                    { props.titleSuccess }
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export const EmptyList = props => {
    const icon = props.icon != null ? props.icon : <AiOutlineMinusCircle size={150} color={`rgba(${color.primaryAlt},0.6)`} />;
    return(
        <Grid container direction="column" justify="center" alignItems="center" style={{padding: 40}}>
            { icon }
            <Typography variant="h5" color="textSecondary" style={{ marginTop: 20}}>{ props.title != null ? props.title : 'Lista vacía' }</Typography>
            <Typography variant="body2" color="textSecondary">{ props.subtitle != null ? props.subtitle : 'Para agregar un nuevo registro presiona el botón de la parte superior derecha.' }</Typography>
        </Grid>
        
    );
}

export const LoadingList = props => {
    return(
        <Grid container direction="column" justify="center" alignItems="center" style={{padding: 40}}>
            <CircularProgress style={{color: color.primary}}/>
            <Typography variant="body" color="textSecondary" style={{ margin: 10}}>Cargando...</Typography>
        </Grid>
        
    );
}

export const YoutubeEmbed = (props) => {
    const { innerWidth } = window;
    let width = props.width ? props.width : 450;
    let height = props.height ? props.height : 253
    if(innerWidth < width){
        return <></>
    }
    return(
        <div className="video-responsive">
            <iframe
                width={ props.width ? props.width : 450 }
                height={ height }
                src={`https://www.youtube.com/embed/${props.embedId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    )
}