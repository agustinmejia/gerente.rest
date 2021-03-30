import React, { Component } from 'react';
import {
  Grid,
  Button,
  IconButton,
  Tooltip,
  Divider,
  InputBase,
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
  Fab,
  Slide
} from '@material-ui/core';

import { IoIosMenu, IoIosAddCircle, IoIosTrash, IoIosSearch, IoIosHome } from "react-icons/io";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
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
    { id: 'id', label: 'Nro' },
    { id: 'customer', label: 'Cliente' },
    { id: 'type', label: 'Tipo' },
    { id: 'total', label: 'Total' },
    { id: 'actions', label: 'Opciones' },
];

class salesList extends Component {
  constructor(props){
    super(props)
    this.state = {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${this.props.authSession.token}`
      },
      branchId: this.props.authSession.branch.id,
      defaultImg: `${API}/images/default-image.png`,
      showDialog: false,
      tableRows: [],
      sidebarToggled: false,
      page: 0,
      inputFilter: '',
      salesLis: [],
      rowsPerPage: 10,
      deleteId: 0,
    }
  }

  createData(id, customer, type, total) {
      let tableOptions = (
          <>
            <Tooltip title="Eliminar venta" placement="top">
                <Fab aria-label="Eliminar venta" size='small' onClick={ () => this.setState({ showDialog: true, deleteId: id }) }>
                    <IoIosTrash size={25} color="#F33417" />
                </Fab>
            </Tooltip>
          </>
      )
      return { id, customer, type, total, actions: tableOptions };
  }

  componentDidMount(){
    if(this.state.branchId){
      this.getSales();
    }
  }

  filter = e => {
    let {value} = e.target
    this.setState({inputFilter: value});
    let rows = [];
    if(value){
      this.state.salesLis.map(sale => {
        let customer = `${sale.customer.person.first_name} ${sale.customer.person.last_name ? sale.customer.person.last_name : ''}`;
        let sale_number = sale.sale_number.toString();
        if(customer.toLowerCase().search(value.toLowerCase()) >= 0 || sale_number.search(value) >= 0){
          rows.push(this.createData(sale.sale_number, customer, sale.sale_type, sale.total));
        }
      });
    }else{
      this.state.salesLis.map(sale => {
        let customer = `${sale.customer.person.first_name} ${sale.customer.person.last_name ? sale.customer.person.last_name : ''}`
        rows.push(this.createData(sale.sale_number, customer, sale.sale_type, sale.total));
      });
    }
    this.setState({tableRows: rows});
  }

  getSales(){
      fetch(`${API}/api/branch/${this.props.authSession.branch.id}/sales`, {headers: this.state.headers})
      .then(res => res.json())
      .then(res => {
        let rows = [];
        if(res.sales){
          this.setState({salesLis: res.sales});
          res.sales.map(sale => {
              let customer = `${sale.customer.person.first_name} ${sale.customer.person.last_name ? sale.customer.person.last_name : ''}`
              rows.push(this.createData(sale.sale_number, customer, sale.sale_type, sale.total));
          });
        }
        this.setState({tableRows: rows});
      })
      .catch(error => ({'error': error}));
  }

  hanldeDelete = () => {
    // let options = {
    //     headers: this.state.headers
    // }
    // axios.get(`${API}/api/product/${this.state.deleteId}/delete`, options)
    // .then(response => {
    //     if(response.data.product){
    //         this.getSales();
    //         this.props.enqueueSnackbar('Sucursal eliminada correctamente!', { variant: 'success' });
    //     }else{
    //         this.props.enqueueSnackbar(response.data.error, { variant: 'error' });
    //     }
    // })
    // .catch(error => ({'error': error}))
    // .finally( () => {
    //     this.setState({showDialog: false});
    // });
    this.setState({showDialog: false});
  }

  render() {
      return (
          <div className='app'>
              <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
              <main style={{paddingTop: 10}}>
                  <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                      <IoIosMenu size={40} />
                  </div>

                  <Navbar title={<h1 style={{marginLeft: 20}}> Mis ventas del día</h1>} />

                  <Grid style={{marginTop: 20}}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Link to='/dashboard/sales/create'>
                              <Button variant="contained" color="primary" endIcon={<IoIosAddCircle/>} > Nueva</Button>
                          </Link>
                      </div>

                      <div style={{ marginTop: 30, marginBottom: 50 }}>
                        {/* Filtro */}
                        <Grid container style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                          <Grid item>
                            <Paper component="form" style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: 30, maxWidth: 400 }}>
                              <Tooltip title="Buscar" placement="bottom" style={{ marginRight: 10 }}>
                                <IconButton color="primary" aria-label="Buscar">
                                  <IoIosSearch size={25} />
                                </IconButton>
                              </Tooltip>
                              {/* Input buscador */}
                              <InputBase
                                placeholder="Nro o cliente"
                                inputProps={{ 'aria-label': 'Nro o cliente' }}
                                onChange={ this.filter }
                                value={ this.state.inputFilter }
                              />
                              <Divider orientation="vertical" style={{ height: 30, margin: 10, marginRight: 20 }} />
                              <Tooltip title="Cambiar sucursal actual" placement="top" style={{ marginLeft: 10 }}>
                                <IconButton color="primary" aria-label="Cambiar sucursal actual" onClick={ (e) => console.log('hi') }>
                                  <IoIosHome size={25} />
                                </IconButton>
                              </Tooltip>
                            </Paper>
                          </Grid>
                        </Grid>

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
                  <DialogTitle id="alert-dialog-title">Anular venta</DialogTitle>
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

export default connect(mapStateToProps)(withSnackbar(salesList));