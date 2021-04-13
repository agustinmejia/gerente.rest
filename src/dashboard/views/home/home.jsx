import React, { Component } from 'react';
import {
    Grid,
    Typography
} from "@material-ui/core";
import { IoIosMenu } from "react-icons/io";

import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";




import PropTypes from "prop-types";
import {
    List,
    ListItem,
    Avatar,
    Button,
    ListItemAvatar,
    ListItemText,
    Tooltip
} from "@material-ui/core";
import { IoMdHome, IoMdBus, IoMdInformationCircle, IoMdArrowDropright, IoMdGitBranch, IoIosRestaurant } from "react-icons/io";
import { Link } from "react-router-dom";
import Tour from 'reactour'
import { env } from '../../../config/env';

const { color } = env;

const steps = [
    {
        selector: '.config-step',
        content: 'Menú desplegable en el cual puedes acceder a las diferentes opciones de configuración de la plataforma.',
    },
    {
        selector: '.sidebar-step',
        content: 'Menú donde se encuantran todas las opciones con las que cuenta la plataforma.',
    },
    {
        selector: '.sidebarToggle-step',
        content: 'Botón para abrir o cerrar el menú.',
    }
];

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            sidebarToggled: false,
            tourActive: false
        }
    }

    componentDidMount(){
        // let { user } = this.props.authSession;
    }

    render() {
        return (
            <div className='app'>
                <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) } className="sidebar-step" classNameToggle="sidebarToggle-step" />
                <main style={{paddingTop: 10, padding: 0,}}>
                    <div style={{paddingTop: 24, paddingLeft: 40, paddingRight: 40}}>
                        <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                            <IoIosMenu size={40} />
                        </div>

                        <Navbar title={<h1 style={{marginLeft: 20}}> Bienvenido, {this.props.authSession.user.name}!</h1>} />
                        
                        <div style={{marginTop: 50}}>
                            <Grid container>
                                <Grid item xs={6} style={{paddingRight: 50}}>
                                    <Typography variant="h6" style={{marginBottom: 20}}>Acerca de Gerente de Restaurantes</Typography>
                                    <Typography variant="body2" align="justify" style={{color: 'rgba(0,0,0,0.5)'}}>
                                        Gerente de Restaurantes es una aplicación web pensada para ayudarte a administrar los procesos que se llevan a cabo en tu restaurantes,
                                        tales como registro de productos, administración de ventas y compras, apertura y cierre de caja, seguimiento de inventarios y generación de reportes y gráficos
                                        que te ayudarán a tener ordenada la información de tu restaurante.
                                    </Typography>
                                    <Grid container direction="column" justify="flex-start" alignItems="flex-start" >
                                        <Grid item>
                                            <hr style={{width: 200, height: 3}}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="button"
                                                size="large"
                                                variant="contained"
                                                style={{ backgroundColor: color.primary, color: 'white', textTransform: 'capitalize'}}
                                                endIcon={<IoMdBus size={20} />}
                                                onClick={ event => this.setState({tourActive: true}) }
                                            >
                                                Hacer un tour
                                            </Button>

                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <YoutubeEmbed embedId="fU8wT6qYw7A" />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <div style={{backgroundColor: 'rgba(0,0,0,0.1)', marginTop: 50, marginBottom: 50}}>
                        <Grid item xs={12} style={{display: 'flex', padding: 30}}>
                            <Grid container>
                                <Typography variant="h6" style={{marginBottom: 20}}>Primeros pasos</Typography>
                                <Grid item xs={12}>
                                    <List>
                                        <TutorialStep
                                            icon={ <IoMdHome /> }
                                            title="Completa la información de tu restaurante"
                                            detail="Puedes completar la información de tu restaurante como el logo, un banner, telefonos de contacto y dirección."
                                            url="/dashboard/mycompany?tour=1"
                                            urlHelp="Administración > Mi restaurante"
                                        />
                                        <TutorialStep
                                            icon={ <IoMdGitBranch /> }
                                            title="Completa la información de tu o tus sucursales"
                                            detail="Puedes completar la información de tu sucursal o incluso puedes agregar nuevas sucursales."
                                            url="/dashboard/branches?tour=1"
                                            urlHelp="Administración > Sucursales"
                                        />
                                        <TutorialStep
                                            icon={ <IoIosRestaurant /> }
                                            title="Agregar los productos que vendes en tu restaurante"
                                            detail="Registra los productos que tienes a la venta en tu restaurante, en el caso de los productos que revendas como las gaseosas o jugos puedes administrar su inventario."
                                            url="/dashboard/products?tour=1"
                                            urlHelp="Administración > Productos"
                                        />
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </main>
                
                <Tour
                    steps={ steps }
                    isOpen={ this.state.tourActive }
                    accentColor={ color.primary }
                    onRequestClose={() => this.setState({tourActive: false})}
                />
            </div>
        );
    }
}

const TutorialStep = props => {
    return(
        <ListItem>
            <ListItemAvatar>
            <Avatar style={{backgroundColor: color.primary}}>
                { props.icon }
            </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={ props.title }
                secondary={ 
                    <>
                        { props.detail }
                        <Tooltip
                            title={
                            <React.Fragment>
                                <Typography color="inherit" variant="subtitle1"> <IoMdInformationCircle size={12} /> Ayuda</Typography>
                                <Typography color="inherit" variant="body2"><em>{"Haz click o también puedes hacerlo en el menú lateral en la opción:"}</em> <br/> <b> <IoMdArrowDropright size={10} /> { props.urlHelp }</b></Typography>
                            </React.Fragment>
                            }
                        >
                            <Link to={ props.url }> Haz click aquí</Link>
                        </Tooltip>
                    </>
                }
            />
        </ListItem>
    );
}

const YoutubeEmbed = (props) => (
    <div className="video-responsive">
        <iframe
            width={ props.width ? props.width : 500 }
            height={ props.height ? props.height : 281 }
            src={`https://www.youtube.com/embed/${props.embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </div>
);


YoutubeEmbed.propTypes = {
    embedId: PropTypes.string.isRequired
};


const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(Home));