import React, { useState } from 'react'
import { ProSidebar, SidebarHeader, SidebarContent, SidebarFooter, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { IoIosHome, IoIosLock, IoIosArrowDropright, IoIosArrowDropleft, IoMdRestaurant } from "react-icons/io";
import { IconButton } from '@material-ui/core';
import "../../style.scss";

const Sidebar = props => {

    var [sidebarColapse, setSidebarColapse] = useState(false);

    return (
        <>
            <ProSidebar
                collapsed={ sidebarColapse }
                breakPoint='md'
                toggled={ props.toggled }
                onToggle={ props.onToggle }
                image='https://cdn.pixabay.com/photo/2015/03/26/10/28/restaurant-691397_960_720.jpg'
            >
                <SidebarHeader>
                    <div style={{ padding: 20, }}>
                        <b style={{ fontSize: 25, color: 'white' }}><img src="favicon.ico" alt="gerente.rest_logo" style={{ width: 40, float: 'left', marginRight: 10 }}/> { sidebarColapse ?  '' : 'Gerente.rest' }</b>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <Menu iconShape="square">
                        <MenuItem icon={ <IoIosHome /> } ><b>Inicio</b></MenuItem>
                        <SubMenu icon={ <IoIosLock /> } title={<b>Seguridad</b>}>
                            <MenuItem><b>Roles</b></MenuItem>
                            <MenuItem><b>Usuarios</b></MenuItem>
                        </SubMenu>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <div style={{ textAlign: 'center', }}>
                        <IconButton aria-label="delete"
                            onClick={ () => setSidebarColapse(!sidebarColapse) }
                        >
                            { sidebarColapse ? <IoIosArrowDropright size={40} color='white' /> : <IoIosArrowDropleft size={40} color='white' /> }
                        </IconButton>
                    </div>
                </SidebarFooter>
            </ProSidebar>
        </>
    );
    }


export default Sidebar;