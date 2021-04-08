import React from 'react'
import { ProSidebar, SidebarHeader, SidebarContent, SidebarFooter, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { IoIosHome, IoIosBriefcase, IoIosBulb, IoIosArrowDropright, IoIosArrowDropleft, IoMdCart, IoIosCash } from "react-icons/io";
import { IconButton } from '@material-ui/core';
import "../../style.scss";

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from "react-router-dom";

const Sidebar = props => {
    const handleSidebar = async () => {
        let config = {
            ...props.globalConfig,
            sidebar: {
                ...props.globalConfig.sidebar,
                collapsed: !props.globalConfig.sidebar.collapsed
            }
        }
        await AsyncStorage.setItem('sessionGlobalConfig', JSON.stringify(config));
        props.setGlobalConfig(config);
    }

    return (
        <>
            <ProSidebar
                collapsed={ props.globalConfig.sidebar.collapsed }
                breakPoint='md'
                toggled={ props.toggled }
                onToggle={ props.onToggle }
                image='https://cdn.pixabay.com/photo/2015/03/26/10/28/restaurant-691397_960_720.jpg'
            >
                <SidebarHeader>
                    <div style={{ padding: 20, }}>
                        <b style={{ fontSize: 25, color: 'white' }}><img src="/favicon.ico" alt="gerente.rest_logo" style={{ width: 40, float: 'left', marginRight: 10 }}/> { props.globalConfig.sidebar.collapsed ?  '' : 'Gerente.rest' }</b>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <Menu iconShape="square">
                        <MenuItem icon={ <IoIosHome size={25} /> } ><Link to="/dashboard">{<b>Inicio</b>}</Link></MenuItem>
                        <SubMenu icon={ <IoIosBriefcase size={25} /> } title={<b>Administración</b>}>
                            <MenuItem><Link to="/dashboard/mycompany">Mi restaurante</Link></MenuItem>
                            <MenuItem><Link to="/dashboard/branches">Sucursales</Link></MenuItem>
                            <MenuItem><Link to="/dashboard/products">Productos</Link></MenuItem>
                            <MenuItem><Link to="/dashboard/sales">Ventas</Link></MenuItem>
                            <MenuItem><Link to="/dashboard/employes">Empleados</Link></MenuItem>
                        </SubMenu>
                        {/* <SubMenu icon={ <IoIosCash size={25} /> } title={<b>Ingresos/Egresos</b>}>
                            <MenuItem><Link to="/dashboard/cashiers">Cajas</Link></MenuItem>
                        </SubMenu> */}
                        <MenuItem icon={ <IoIosCash size={25} /> } ><Link to="/dashboard/cashiers">{<b>Cajas</b>}</Link></MenuItem>
                        <MenuItem icon={ <IoMdCart size={25} /> } ><Link to="/dashboard/sales/create">{<b>Vender</b>}</Link></MenuItem>
                        <SubMenu icon={ <IoIosBulb size={25} /> } title={<b>Complementos</b>}>
                            <MenuItem><Link to="/dashboard/tickets" target="_blank">Tickets</Link></MenuItem>
                        </SubMenu>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <div style={{ textAlign: 'center', }}>
                        <IconButton aria-label="delete"
                            onClick={ handleSidebar }
                        >
                            { props.globalConfig.sidebar.collapsed ? <IoIosArrowDropright size={40} color='white' /> : <IoIosArrowDropleft size={40} color='white' /> }
                        </IconButton>
                    </div>
                </SidebarFooter>
            </ProSidebar>
        </>
    );
}

const mapStateToProps = (state) => {
  return {
    globalConfig: state.globalConfig,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGlobalConfig : (globalConfig) => dispatch({
        type: 'SET_GLOBAL_CONFIG',
        payload: globalConfig
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);