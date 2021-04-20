import React, { Component } from 'react';
import {
  Grid,
  Button,
  Tooltip,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@material-ui/core';

import { IoIosMenu, IoIosAddCircle, IoIosCreate, IoIosTrash } from "react-icons/io";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import axios from "axios";
import { withSnackbar } from 'notistack';
import Tour from 'reactour';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { EmptyList, LoadingList } from "../../components/forms";
import { env } from '../../../config/env';

const { API, color } = env;

const transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const tableColumns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Nombre' },
  { id: 'phones', label: 'Telefonos' },
  { id: 'address', label: 'Dirección' },
  { id: 'actions', label: 'Opciones', align: 'right' },
];

const steps = [
  {
    selector: '.list-step',
    content: 'Lista de sucursales de tu restaurante con las opciones de edición y eliminación.',
  },
  {
    selector: '.add-step',
    content: 'Presiona para añadir una nueva sucursal de tu restaurante.',
  }
];

class BranchesList extends Component {
    constructor(props){
      super(props)
      this.state = {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${this.props.authSession.token}`
        },
        loadingList: false,
        tourActive: false,
        showDialog: false,
        tableRows: [],
        sidebarToggled: false,
        page: 0,
        rowsPerPage: 10,
        deleteId: 0,
      }
    }

    createData(id, name, phones, address) {
      let tableOptions = (
        <>
          <Link to={`/dashboard/branches/${id}/edit`} style={{marginRight: 10}}>
            <Tooltip title="Editar sucursal" placement="top">
              <Fab aria-label="Editar sucursal" size='small'>
                <IoIosCreate size={25} style={{color: color.skyBlue}} />
              </Fab>
            </Tooltip>
          </Link>
          <Tooltip title="Eliminar sucursal" placement="top">
            <Fab aria-label="Eliminar sucursal" size='small' onClick={ () => this.setState({ showDialog: true, deleteId: id }) }>
              <IoIosTrash size={25} style={{color: color.red}} />
            </Fab>
          </Tooltip>
        </>
      )
      return { id, name, phones, address, actions: tableOptions };
    }

    componentDidMount(){
      this.getData();
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      if(urlParams.get('tour') == 1){
        setTimeout(() => {
          this.setState({tourActive: true});
        }, 1500);
      }
    }

    getData(){
      this.setState({loadingList: true});
      let { company } = this.props.authSession;
        fetch(`${API}/api/company/${company.id}/branches/list`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
          let rows = [];
          if(res.branches){
            res.branches.map(branch => {
              rows.push(this.createData(branch.id, branch.name, branch.phones, branch.address));
            });
          }
          this.setState({tableRows: rows});
        })
        .catch(error => ({'error': error}))
        .finally(() => this.setState({loadingList: false}));
    }

    hanldeDelete = () => {
      if(this.state.tableRows.length == 1){
        this.props.enqueueSnackbar('No puedes eliminar tu única sucursal!', { variant: 'warning' });
        this.setState({showDialog: false});
        return;
      }

      let options = {
        headers: this.state.headers
      }
      axios.get(`${API}/api/branch/${this.state.deleteId}/delete`, options)
      .then(response => {
        if(response.data.branch){
          this.getData();
          this.props.enqueueSnackbar('Sucursal eliminada correctamente!', { variant: 'success' });
        }else{
          this.props.enqueueSnackbar(response.data.error, { variant: 'error' });
        }
      })
      .catch(error => ({'error': error}))
      .finally( () => {
        this.setState({showDialog: false});
      });
    }

    render() {
        return (
            <div className='app'>
                <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
                <main style={{paddingTop: 10}}>
                  <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                      <IoIosMenu size={40} />
                  </div>

                  <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> Sucursales</h1>} />

                  <Grid style={{marginTop: 20}}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to='/dashboard/branches/create'>
                            <Button variant="contained" style={{backgroundColor: color.primary, color: 'white'}} className="add-step" endIcon={<IoIosAddCircle/>} > Crear nueva</Button>
                        </Link>
                    </div>
                    <div style={{ marginTop: 30, marginBottom: 50 }}>
                      <Paper className="list-step">
                        { this.state.loadingList && <LoadingList /> }
                        { this.state.tableRows.length === 0 && !this.state.loadingList && <EmptyList /> }
                        { this.state.tableRows.length > 0 &&
                          <>
                            <TableContainer>
                              <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                  <TableRow>
                                    {tableColumns.map((column) => (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                      >
                                        {column.label}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {this.state.tableRows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                    return (
                                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {tableColumns.map((column) => {
                                          const value = row[column.id];
                                          return (
                                            <TableCell key={column.id} align={column.align}>
                                              {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                          );
                                        })}
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <TablePagination
                              rowsPerPageOptions={[10, 25, 100]}
                              component="div"
                              count={this.state.tableRows.length}
                              rowsPerPage={this.state.rowsPerPage}
                              page={this.state.page}
                              labelRowsPerPage='Items por página'
                              onChangePage={(event, newPage) => this.setState({page: newPage})}
                              onChangeRowsPerPage={(event) => this.setState({rowsPerPage: +event.target.value, page: 0})}
                            />
                          </>
                        }
                      </Paper>
                    </div>
                  </Grid>
                </main>

                {/* Delete dialog */}
                <Dialog
                  open={ this.state.showDialog }
                  TransitionComponent={ transition }
                  onClose={ () => this.setState({ showDialog: false }) }
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ésta acción eliminará de forma permanente el registro y no podrás usarlo en el futuro.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={ () => this.setState({ showDialog: false }) }>
                      Cancelar
                    </Button>
                    <Button onClick={ this.hanldeDelete } style={{color: color.red}}>
                      Eliminar
                    </Button>
                  </DialogActions>
                </Dialog>


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

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(BranchesList));