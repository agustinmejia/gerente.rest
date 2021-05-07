import React, { Component } from 'react';
import {
    Grid,
    Typography,
}from '@material-ui/core';
import { Link } from "react-router-dom";
import { IoIosMail, IoLogoFacebook, IoLogoWhatsapp, IoLogoInstagram, IoLogoLinkedin, IoLogoYoutube, IoLogoTwitter } from "react-icons/io";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";

import JsonData from '../data/data.json';


import { env } from '../../env';

const { color } = env;

export class Footer extends Component {
    render(){
        const { Contact } = JsonData
        return (
            <Grid container style={{backgroundColor: color.secondary, marginTop: 100, padding: 50, paddingTop: 40}}>
                <Grid item sm={9} xs={12}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid item xs={12} >
                                <Typography variant="h4" style={{color: 'rgba(255,255,255,0.8)'}}>Gerente de Restaurantes</Typography>
                                <Typography variant="body2" style={{color: 'rgba(255,255,255,0.8)'}}>Todo lo que necesitas para hacer crecer tu negocio</Typography>
                            </Grid>
                            <Grid item xs={12} style={{marginTop: 50}}>
                                <Grid container>
                                    <Grid item md={4} xs={6} style={{marginBottom: 20}}>
                                        <Typography variant="subtitle1" style={{color: '#fff'}}>Información</Typography>
                                        <Grid item style={{marginTop: 10}}>
                                            <ExternalLink url="https://docs.gerente.rest/docs/" title="Acerca de nosotros" />
                                            <ExternalLink url="#" title="Pregunstas frecuentes" />
                                            <ExternalLink url="https://docs.gerente.rest/" title="Documentación" />
                                            <ExternalLink url="https://docs.gerente.rest/docs/information/terms" title="Terminos y condiciones" />
                                            <ExternalLink url="https://docs.gerente.rest/docs/information/policies" title="Políticas de privacidad" />
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} xs={6} style={{marginBottom: 20}}>
                                        <Typography variant="subtitle1" style={{color: '#fff'}}>Servicios</Typography>
                                        <Grid item style={{marginTop: 10}}>
                                            <ExternalLink url="#" title="Inventario de productos" />
                                            <ExternalLink url="#" title="Marketing digital" />
                                            <ExternalLink url="#" title="Diseño gráfico" />
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} xs={6} style={{marginBottom: 20}}>
                                        <Typography variant="subtitle1" style={{color: '#fff'}}>Contacto</Typography>
                                        <Grid item style={{marginTop: 10}}>
                                            <ExternalLink url="#" title="Soporte técino" />
                                            <ExternalLink url="#" title="Trabaja con nosotros" />
                                            <ExternalLink url="#" title="Reportar un problema" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={3} xs={12}>
                    <Grid container direction="column" justify="flex-end" alignItems="flex-end" style={{marginTop: 30}}>
                        <Typography variant="h6" style={{color: 'white'}}>Comunícate con nosotros</Typography>
                        <small style={{color: 'white', textAlign: 'right'}}>Puedes contactarnos a través de los siguientes medios</small>
                        <div style={{marginTop: 30}}>
                            <Typography variant="subtitle1" style={{color: 'white', marginTop: 5}}> <FaPhone size={20} style={{marginRight: 10}} /> <a href={ Contact ? `tel:+591${Contact.phone}` : "loading" } style={{color: 'white'}}>{ Contact ? `+591 ${Contact.phone}` : "loading" }</a> </Typography>
                            <Typography variant="subtitle1" style={{color: 'white', marginTop: 5}}> <IoIosMail size={20} style={{marginRight: 10}} /> { Contact ? Contact.email : "loading" } </Typography>
                            <Typography variant="subtitle1" style={{color: 'white', marginTop: 5}}> <FaMapMarkerAlt size={20} style={{marginRight: 10}} /> { Contact ? Contact.address : "loading" } </Typography>
                        </div>
                        <div style={{marginTop: 50}}>
                            <a href={ Contact ? Contact.facebook : "loading" } target="_blank"><IoLogoFacebook size={30} style={{marginLeft: 10}} color="white" /></a>
                            <a href={ Contact ? Contact.twitter : "loading" } target="_blank"><IoLogoTwitter size={30} style={{marginLeft: 10}} color="white" /></a>
                            <a href={ Contact ? `https://wa.me/591${Contact.phone}` : "loading" } target="_blank"><IoLogoWhatsapp size={30} style={{marginLeft: 10}} color="white" /></a>
                            {/* <a href="" target="_blank"><IoLogoInstagram size={30} style={{marginLeft: 10}} color="white" /></a>
                            <a href="" target="_blank"><IoLogoLinkedin size={30} style={{marginLeft: 10}} color="white" /></a> */}
                            <a href={ Contact ? Contact.youtube : "loading" } target="_blank"><IoLogoYoutube size={30} style={{marginLeft: 10}} color="white" /></a>
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{marginTop: 50}}>
                    <Typography style={{color: 'white'}} align="center">
                        {'Copyright © '} <a href="https://gerente.rest">Gerente de restaurantes{' '}</a>{' '}{new Date().getFullYear()}
                    </Typography>
                </Grid>
            </Grid>  
        );
    }   
}

const ExternalLink = props => {
    return(
        <a href={ props.url }>
            <Typography variant="body2" style={{color: 'rgba(255,255,255,0.5)', margin: 3}}>{ props.title }</Typography>
        </a>
    );
}

export default Footer;
