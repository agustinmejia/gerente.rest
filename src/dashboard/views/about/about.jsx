import React, { Component } from 'react';
import {
    Grid,
    Paper,
    Backdrop,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
}from '@material-ui/core';
import { IoIosMenu, IoLogoGithub, IoLogoTwitter, IoLogoGoogle, IoLogoWhatsapp } from "react-icons/io";
import 'moment/locale/es';
import { connect } from 'react-redux';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../env';

const { API, color } = env;

class About extends Component {
    constructor(props){
        super(props)
        this.state = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authSession.token}`
            },
            sidebarToggled: false,
            loading: false,
            subscriptionType: []
        }
    }

    async componentDidMount(){
        let res = await fetch(`${API}/api/subscriptions_types/list`, {headers: this.state.headers})
        .then(res => res.json())
        .catch(error => ({'error': error}));
        if(!res.error){
            this.setState({
                subscriptionType: res.subscription_type
            })
            console.log(res.subscription_type)
        }
    }

    render() {
        return (
            <>
                { this.state.loading &&
                    <Backdrop open={true} style={{ zIndex: 20 }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                }
                <div className='app'>
                    <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
                    <main style={{paddingTop: 10}}>
                        <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                            <IoIosMenu size={40} />
                        </div>

                        <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> Acerca de Gerente de Restaurantes</h1>} />
                        
                            <form onSubmit={ this.handleSubmit } >
                                <Grid container spacing={2} direction="row" justify="center" alignItems="flex-start">
                                    <Grid item xs={12} sm={4}>
                                        <Paper style={{ backgroundColor: 'white', padding: 30, paddingBottom: 30, marginTop: 50}}>
                                            <Grid container direction="column" justify="center" alignItems="center">
                                                <Grid item xs={12}>
                                                    <CardMedia
                                                        style={{ width: 200, height: 200, borderRadius: 100, border: `3px solid ${color.primary}` }}
                                                        image="/img/about/profile.jpeg"
                                                        title="Foto de perfil"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginTop: 10 }}>
                                                    <Typography variant="h6">Ing. Agustin Mejia Muiba</Typography>
                                                    <Typography variant="subtitle2" style={{ textAlign: 'center', color: 'rgba(0,0,0,0.7)', textTransform: 'capitalize' }}>Desarrollador</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                                                    <Grid item style={{ marginTop: 30 }}>
                                                        <a href="https://twitter.com/AgustinMejiaM" target="_blank"><Typography variant="subtitle2" color="textSecondary"><IoLogoTwitter /> https://twitter.com/AgustinMejiaM</Typography></a>
                                                        <a href="https://github.com/agustinmejia" target="_blank"><Typography variant="subtitle2" color="textSecondary"><IoLogoGithub /> https://github.com/agustinmejia</Typography></a>
                                                        <a href="https://wa.link/lehznz" target="_blank"><Typography variant="subtitle2" color="textSecondary"><IoLogoWhatsapp /> +591 75199157</Typography></a>
                                                        <a href="mail:agustinmejiamuiba@gmail.com" target="_blank"><Typography variant="subtitle2" color="textSecondary"><IoLogoGoogle /> agustinmejiamuiba@gmail.com</Typography></a>
                                                    </Grid>
                                                </Grid>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Paper style={{ backgroundColor: 'white', padding: 30, paddingTop: 10, marginTop: 50}}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} style={{margin:10, marginTop: 30}}>
                                                    <Typography color="textSecondary" variant="body2" align="justify">
                                                        Gerente de Restaurantes es una aplicación web pensada para ayudarte a administrar los procesos que se llevan a cabo en tu restaurantes, tales como registro de productos, administración de ventas y compras, apertura y cierre de caja, seguimiento de inventarios y generación de reportes y gráficos que te ayudarán a tener ordenada la información de tu restaurante.
                                                    </Typography>
                                                    
                                                    <Typography color="textSecondary" variant="h6" style={{ marginTop: 20 }}>
                                                        Precios
                                                    </Typography>
                                                    
                                                    <Grid container style={{ marginTop: 20, marginBottom: 30 }}>
                                                        {
                                                            this.state.subscriptionType.map(item =>
                                                                <Grid item xs={12} lg={4} key={item.id} style={{ padding: 5 }}>
                                                                    <Card>
                                                                        <CardContent>
                                                                            <Typography variant="h5" component="h2" style={{textAlign: 'right', marginBottom: 20}}>
                                                                                <small>Bs.</small> { item.price }
                                                                            </Typography>
                                                                            <Typography variant="body2" component="p" color="textSecondary">
                                                                                { item.description }
                                                                            </Typography>
                                                                        </CardContent>
                                                                        <CardActions>
                                                                            <Typography color="textSecondary"><b>{ item.name }</b></Typography>
                                                                        </CardActions>
                                                                    </Card>
                                                                </Grid>    
                                                            )
                                                        }
                                                    </Grid>
                                                    
                                                    <Typography color="textSecondary" variant="h6" style={{ marginTop: 20 }}>
                                                        Formas de pago
                                                    </Typography>
                                                    <div style={{ marginTop: 20 }}>
                                                        <Info title="Tansferencia bancaria">
                                                            Cuenta de Banco Unión: <b>123261998</b>
                                                        </Info>
                                                        <Info title="Tigo Money">
                                                            Nro: <b>75199157</b>
                                                        </Info>
                                                    </div>
                                                    
                                                    <Typography color="textSecondary" variant="h6" style={{ marginTop: 20 }}>
                                                        Más información
                                                    </Typography>
                                                    <Typography color="textSecondary" variant="body2" align="justify">
                                                        Para obtener más información acerca de las funcionalidades del sistema y los precios, puedes comunicarte con el desarrollador del sistema al número o email que aparecen en su información personal. También puedes obtener información en la empresa "Server La Estrella".
                                                    </Typography>
                                                    <div style={{ marginTop: 20 }}>
                                                        <Info title="Sitio web">
                                                            Ingresa al link <a href="https://serverlaestrella.com/" target="_blank">serverlaestrella.com</a>
                                                        </Info>
                                                        <Info title="Telefonos">
                                                            Whatsapp (+591) 71142010 - (+591) 60202107
                                                        </Info>
                                                        <Info title="Email">
                                                            serverlaestrella@gmail.com
                                                        </Info>
                                                        <Info title="Dirección">
                                                            Calle 9 de Abril # 215 entre F. Pinto y F. Sattory
                                                        </Info>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </form>
                    </main>
                </div>
            </>
        );
    }
}

const Info = props => (
    <div style={{ marginBottom: 10 }}>
        <Typography variant="caption" color="textSecondary"><b>{ props.title }</b></Typography>
        <Typography variant="subtitle2" color="textSecondary">{ props.children }</Typography>
    </div>
)

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
        globalConfig: state.globalConfig,
    }
}

export default connect(mapStateToProps)(About);