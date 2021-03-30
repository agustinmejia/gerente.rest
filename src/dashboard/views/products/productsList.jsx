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
  Avatar,
  Slide
} from '@material-ui/core';

import { IoIosMenu, IoIosAddCircle, IoIosCreate, IoIosTrash } from "react-icons/io";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import axios from "axios";
import { withSnackbar } from 'notistack';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../config/env';

const { API } = env;

const transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const tableColumns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Nombre' },
  { id: 'type', label: 'Categoría' },
  { id: 'price', label: 'Precio' },
  { id: 'image', label: 'Imagen' },
  { id: 'actions', label: 'Opciones' },
];

class ProductsList extends Component {
    constructor(props){
        super(props)
        this.state = {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${this.props.authSession.token}`
          },
          defaultImg: `${API}/images/default-image.png`,
          showDialog: false,
          tableRows: [],
          sidebarToggled: false,
          page: 0,
          rowsPerPage: 10,
          deleteId: 0,
        }
    }

    createData(id, name, type, price, image) {
      let tableOptions = (
        <>
          <Link to={`/dashboard/products/${id}/edit`} style={{marginRight: 10}}>
            <Tooltip title="Editar productos" placement="top">
              <Fab aria-label="Editar productos" size='small'>
                <IoIosCreate size={25} color="#0D9CCE" />
              </Fab>
            </Tooltip>
          </Link>
          <Tooltip title="Eliminar productos" placement="top">
            <Fab aria-label="Eliminar productos" size='small' onClick={ () => this.setState({ showDialog: true, deleteId: id }) }>
              <IoIosTrash size={25} color="#F33417" />
            </Fab>
          </Tooltip>
        </>
      )
      return { id, name, type, price, image: <Avatar src={image ? `${API}/storage/${image.replace('.', '-cropped.')}` : this.state.defaultImg} style={{width: 80, height: 80}} />, actions: tableOptions };
    }

    componentDidMount(){
        this.getProducts();
    }

    getProducts(){
        let { company } = this.props.authSession;
        fetch(`${API}/api/company/${company.id}/products/list`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
          let rows = [];
          if(res.products){
            res.products.map(product => {
                rows.push(this.createData(product.id, product.name, product.type, product.price, product.image));
            });
          }
          this.setState({tableRows: rows});
        })
        .catch(error => ({'error': error}));
    }

    hanldeDelete = () => {
        let options = {
            headers: this.state.headers
        }
        axios.get(`${API}/api/product/${this.state.deleteId}/delete`, options)
        .then(response => {
            if(response.data.product){
                this.getProducts();
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

                    <Navbar title={<h1 style={{marginLeft: 20}}> Mis productos</h1>} />

                    <Grid style={{marginTop: 20}}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to='/dashboard/products/create'>
                                <Button variant="contained" color="primary" endIcon={<IoIosAddCircle/>} > Nuevo</Button>
                            </Link>
                        </div>
                        
                        <div style={{ marginTop: 30, marginBottom: 50 }}>
                            <Paper >
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
                            <Button onClick={ () => this.setState({ showDialog: false }) } color="primary">
                            Cancelar
                            </Button>
                            <Button onClick={ this.hanldeDelete } color="secondary" autoFocus>
                            Eliminar
                            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(ProductsList));