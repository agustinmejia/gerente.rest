import React from 'react';
import {
    Grid,
    Button
}from '@material-ui/core';
import { Link } from "react-router-dom";
import { IoIosCheckmarkCircle, IoIosArrowDropleft } from "react-icons/io";

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