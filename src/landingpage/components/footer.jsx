import React, { Component } from 'react';
import {
    Grid,
    Typography,
}from '@material-ui/core';
import { Link } from "react-router-dom";
import { IoIosMail, IoLogoFacebook, IoLogoWhatsapp, IoLogoInstagram, IoLogoLinkedin, IoLogoYoutube, IoLogoTwitter } from "react-icons/io";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";

import JsonData from '../data/data.json';


import { env } from '../../config/env';

const { color } = env;

export class Footer extends Component {
    render(){
        const { Contact } = JsonData
        return (
            <Grid container style={{backgroundColor: color.secondary, marginTop: 100, padding: 50, paddingTop: 40,}}>
                <Grid item xs={9}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid item xs={12} >
                                <Typography variant="h4" style={{color: 'rgba(255,255,255,0.8)'}}>Gerente de Restaurantes</Typography>
                                <Typography variant="body2" style={{color: 'rgba(255,255,255,0.8)'}}>Todo lo que necesitas para hacer crecer tu negocio</Typography>
                            </Grid>
                            <Grid item xs={12} style={{marginTop: 50, marginBottom: 80}}>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle1" style={{color: '#fff'}}>Información</Typography>
                                        <Grid item style={{marginTop: 10}}>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Acerca de nosotros</Typography>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Pregunstas frecuentes</Typography>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Documentación</Typography>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Terminos y condiciones</Typography>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Políticas de privacidad</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle1" style={{color: '#fff'}}>Servicios</Typography>
                                        <Grid item style={{marginTop: 10}}>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Inventario de productos</Typography>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Marketing digital</Typography>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Diseño gráfico</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle1" style={{color: '#fff'}}>Contacto</Typography>
                                        <Grid item style={{marginTop: 10}}>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Soporte técino</Typography>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Trabaja con nosotros</Typography>
                                            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>Reportar un problema</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Grid container direction="column" justify="flex-end" alignItems="flex-end" style={{marginTop: 30}}>
                        <Typography variant="h6" style={{color: 'white'}}>Comunícate con nosotros</Typography>
                        <small style={{color: 'white'}}>Puedes contactarnos a través de los siguientes medios</small>
                        <div style={{marginTop: 30}}>
                            <Typography variant="subtitle1" style={{color: 'white', marginTop: 5}}> <FaPhone size={20} style={{marginRight: 10}} /> { Contact ? Contact.phone : "loading" } </Typography>
                            <Typography variant="subtitle1" style={{color: 'white', marginTop: 5}}> <IoIosMail size={20} style={{marginRight: 10}} /> { Contact ? Contact.email : "loading" } </Typography>
                            <Typography variant="subtitle1" style={{color: 'white', marginTop: 5}}> <FaMapMarkerAlt size={20} style={{marginRight: 10}} /> { Contact ? Contact.address : "loading" } </Typography>
                        </div>
                        <div style={{marginTop: 50}}>
                            <IoLogoFacebook size={30} style={{marginLeft: 10}} color="white" />
                            <IoLogoTwitter size={30} style={{marginLeft: 10}} color="white" />
                            <IoLogoWhatsapp size={30} style={{marginLeft: 10}} color="white" />
                            <IoLogoInstagram size={30} style={{marginLeft: 10}} color="white" />
                            <IoLogoLinkedin size={30} style={{marginLeft: 10}} color="white" />
                            <IoLogoYoutube size={30} style={{marginLeft: 10}} color="white" />
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12} >
                    <Typography style={{color: 'white'}} align="center">
                        {'Copyright © '} <Link to="https://gerente.rest">Gerente de restaurantes{' '}</Link>{' '}{new Date().getFullYear()}
                    </Typography>
                </Grid>
            </Grid>  
        );
    }   
}

export default Footer;
