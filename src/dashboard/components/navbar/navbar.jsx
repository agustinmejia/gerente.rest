import React, { Component } from 'react';

import {
    Avatar,
    Button,
    Typography,
    Menu,
    Divider,
    Grid,
    Drawer,
    // List
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Badge,
    Tooltip,
    Switch
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { IoMdArrowDropdown, IoMdPerson, IoMdOptions, IoMdPower, IoIosNotifications } from "react-icons/io";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { Link, Redirect } from "react-router-dom";

import { env } from '../../../env';
const {API: URL, color} = env;

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid red`,
    padding: '0 4px',
  },
}))(Badge);


class Navbar extends Component {
    constructor(props){
        super(props)
        this.state = {
            sidebarToggled: false,
            anchorEl: null,
            anchorElNotifications: null,
            drawerOpen: false,
            logout: false,
            // Accesibility
            helpTour: this.props.globalConfig.help ? this.props.globalConfig.help.tour : true,
            helpTips: this.props.globalConfig.help ? this.props.globalConfig.help.tips : true
        }
    }

    async handleHelpConfig(){
        let { helpTour, helpTips } = this.state;
        let config = {
            ...this.props.globalConfig,
            help: {
                tour: helpTour,
                tips: helpTips
            }
        }
        await AsyncStorage.setItem('sessionGlobalConfig', JSON.stringify(config));
        this.props.setGlobalConfig(config);
    }

    logout = async () =>{
        try {
            await AsyncStorage.setItem('sessionAuthSession', '{}');
            this.props.setAuthSession({});
            this.setState({logout: true});
        } catch (e) {console.log(e)}
    }

    render() {
        if(this.state.logout){
            return <Redirect to='/login' />
        }

        return (
            <header style={{ marginBottom: 0 }}>
                <Grid container>
                    <Grid item md={10} xs={8} >
                        { this.props.title }
                    </Grid>
                    <Grid item md={2} xs={4} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                        <Grid container direction="row" justify="flex-end" alignItems="center">
                            <Grid item>
                                <>
                                    {
                                        false &&
                                        <IconButton aria-controls="simple-menu-notifications" aria-haspopup="true" onClick={ event => this.setState({anchorElNotifications: event.currentTarget}) } style={{marginRight: 20}}>
                                            <Tooltip title="Notificaciones" placement="bottom">
                                                <StyledBadge badgeContent={4} color="secondary" >
                                                    <IoIosNotifications size={30} />
                                                </StyledBadge>
                                            </Tooltip>
                                        </IconButton>
                                    }
                                    {
                                        true &&
                                        <IconButton aria-controls="simple-menu-notifications" aria-haspopup="true" onClick={ event => this.setState({anchorElNotifications: event.currentTarget}) } style={{marginRight: 20}}>
                                            <Tooltip title="Notificaciones" placement="bottom">
                                                <IoIosNotifications size={30} />
                                            </Tooltip>
                                        </IconButton>
                                    }
                                </>
                                <Menu
                                    id="simple-menu-notifications"
                                    anchorEl={this.state.anchorElNotifications}
                                    keepMounted
                                    open={Boolean(this.state.anchorElNotifications)}
                                    onClose={ () => this.setState({anchorElNotifications: null}) }
                                >                                
                                    <List component="nav" aria-label="Opciones de configuración">
                                        <ListItem>
                                            {/* <Grid container spacing={2}>
                                                <Grid item>
                                                    <ButtonBase>
                                                        <img style={{width: 80}} alt="complex" src="https://cdn.pixabay.com/photo/2021/01/15/17/01/green-5919790__340.jpg" />
                                                    </ButtonBase>
                                                </Grid>
                                                <Grid item xs={12} sm container>
                                                    <Grid item xs container direction="column" spacing={2}>
                                                        <Grid item xs>
                                                            <Typography variant="body2" gutterBottom>
                                                                Full resolution 1920x1080 • JPEG
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Hace 8 horas
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid> */}
                                            <Typography variant="body2" color="textSecondary">Sin notificationes</Typography>
                                        </ListItem>
                                    </List>
                                </Menu>
                            </Grid>

                            <Grid item>
                                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={ event => this.setState({anchorEl: event.currentTarget}) } className="config-step">
                                    { this.props.authSession.user &&
                                        <>
                                            <Avatar alt="User" src={this.props.authSession.user.avatar.search('https') ? `${URL}/storage/${this.props.authSession.user.avatar}` : this.props.authSession.user.avatar} /> <IoMdArrowDropdown size={15} />
                                        </>
                                    }
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={this.state.anchorEl}
                                    keepMounted
                                    open={Boolean(this.state.anchorEl)}
                                    onClose={ () => this.setState({anchorEl: null}) }
                                >                                
                                    <List component="nav" aria-label="Opciones de configuración">
                                        <Link to="/dashboard/profile">
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <IoMdPerson size={20} color={ color.primary } />
                                                </ListItemIcon>
                                                <ListItemText primary="Perfil" />
                                            </ListItem>
                                        </Link>
                                        <ListItem button onClick={ e => this.setState({anchorEl: null, drawerOpen: true}) }>
                                            <ListItemIcon>
                                                <IoMdOptions size={20} color={ color.primary } />
                                            </ListItemIcon>
                                            <ListItemText primary="Configuración" style={{ color: color.primary }} />
                                        </ListItem>
                                    </List>
                                    <Divider style={{width: '100%'}} />
                                    <List component="nav" aria-label="Salir">
                                        <ListItem button onClick={this.logout}>
                                            <ListItemIcon>
                                                <IoMdPower size={20} color={ color.primary } />
                                            </ListItemIcon>
                                            <ListItemText primary="Salir" style={{ color: color.primary }} />
                                        </ListItem>
                                    </List>
                                </Menu>
                            </Grid>
                        </Grid>

                        <Drawer anchor='right' open={ this.state.drawerOpen } onClose={(e) => this.setState({drawerOpen: false}) }>
                            <div style={{width: 350}}>
                                {/* Panel de configuración */}
                                <Grid container direction="column" justify="flex-start" alignItems="center" style={{paddingTop: 20,}} >
                                    <Grid item xs={12} >
                                        <Typography variant="h6">Configuración</Typography>
                                    </Grid>
                                </Grid>

                                <div style={{padding: 10, paddingBottom: 0, paddingTop: 30,}}><Typography variant="subtitule1" color="textSecondary">Configuración de accesibilidad</Typography></div>
                                <Grid container direction="row" justify="space-between" alignItems="flex-start" style={{paddingLeft: 20, paddingRight: 20}} >                                  
                                    <Grid item xs={9} style={{padding: 10}}>
                                        <Typography variant="body1">Tour por el sistema</Typography>
                                    </Grid>
                                    <Grid item xs={3} >
                                        <Tooltip title="Tour de recorrido por el sistema" placement="bottom">
                                            <Switch checked={ this.state.helpTour } onChange={ (e) => this.setState({helpTour: !this.state.helpTour}, () => this.handleHelpConfig()) } name="switch-helpTour" color="primary" />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={9} style={{padding: 10}}>
                                        <Typography variant="body1">Tips de ayuda</Typography>
                                    </Grid>
                                    <Grid item xs={3} >
                                        <Tooltip title="Tips de ayuda" placement="bottom">
                                            <Switch checked={ this.state.helpTips } onChange={ (e) => this.setState({helpTips: !this.state.helpTips}, () => this.handleHelpConfig()) } name="switch-helpTips" color="primary" />
                                        </Tooltip>
                                    </Grid>
                                    <Divider style={{width: '100%'}} />
                                </Grid>
                            </div>
                        </Drawer>
                    </Grid> 
                </Grid>
            </header>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
        globalConfig: state.globalConfig,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAuthSession : (authSession) => dispatch({
            type: 'SET_AUTH_SESSION',
            payload: authSession
        }),
        setGlobalConfig : (globalConfig) => dispatch({
            type: 'SET_GLOBAL_CONFIG',
            payload: globalConfig
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);