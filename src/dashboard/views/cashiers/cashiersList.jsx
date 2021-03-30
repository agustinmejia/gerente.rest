import React, { Component } from 'react';
import {
  Grid,
  Box,
  Button,
  IconButton,
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
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Chip,
  Typography
} from '@material-ui/core';

import { IoIosMenu, IoIosTrash, IoMdKey, IoIosArrowDropdownCircle, IoIosArrowDropupCircle, IoIosLock } from "react-icons/io";
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
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Caja' },
  { id: 'iconStatus', label: 'Estado' },
  { id: 'actions', label: 'Opciones' },
];

class CashiersList extends Component {
    constructor(props){
        super(props)
        this.state = {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${this.props.authSession.token}`
          },
          showDialog: false,
          cashiers: [],
          tableRows: [],
          sidebarToggled: false,
          page: 0,
          rowsPerPage: 10,
          deleteId: 0,
        }
    }

    createData(id, name, user, status, opening_amount, closing_amount, missing_amount, details) {
      let tableOptions = (
        <>
          {/* <Link to={`/dashboard/branches/${id}/edit`} style={{marginRight: 10}}>
            <Tooltip title="Editar sucursal" placement="top">
              <Fab aria-label="Editar sucursal" size='small'>
                <IoIosCreate size={25} color="#0D9CCE" />
              </Fab>
            </Tooltip>
          </Link> */}
          { status == 1 && details.length > 0 &&
            <Link to={`/dashboard/cashiers/${id}/close`}>
              <Tooltip title="Cerrar caja" placement="top">
                <Fab aria-label="Cerrar caja" size='small' onClick={ () => this.setState({ showDialog: true, deleteId: id }) }>
                  <IoIosLock size={25} color="#138D75" />
                </Fab>
              </Tooltip>
            </Link>
          }
          { status == 1 && details.length == 0 &&
            <Tooltip title="Eliminar caja" placement="top">
              <Fab aria-label="Eliminar caja" size='small' onClick={ () => this.setState({ showDialog: true, deleteId: id }) }>
                <IoIosTrash size={25} color="#F33417" />
              </Fab>
            </Tooltip>
          }
        </>
      )
      let title = <>
                    <b>{name}</b><br/>
                    <small>Abierta por <b>{user}</b></small>
                  </>
      let iconStatus = status == 1 ? <Chip label="Abierta" color='primary' icon={<IoMdKey size={15} />} /> : <Chip label="Cerrada" icon={<IoIosLock size={18} />} />
      return { id, name: title, iconStatus, status, opening_amount, closing_amount, missing_amount, details, actions: tableOptions };
    }

    componentDidMount(){
        this.getData()
    }

    getData(){
      let { company } = this.props.authSession;
        fetch(`${API}/api/company/${company.id}/cashier/list`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
          let rows = [];
          if(res.cashiers){
            res.cashiers.map(cashier => {
              rows.push(this.createData(cashier.id, cashier.name, cashier.user.name, cashier.status, cashier.opening_amount, cashier.closing_amount, cashier.missing_amount, cashier.details));
            });
          }
          this.setState({tableRows: rows, cashiers: res.cashiers});
        })
        .catch(error => ({'error': error}));
    }

    hanldeDelete = () => {
    //   let options = {
    //     headers: this.state.headers
    //   }
    //   axios.get(`${API}/api/branch/${this.state.deleteId}/delete`, options)
    //   .then(response => {
    //     if(response.data.branch){
    //       this.getData();
    //       this.props.enqueueSnackbar('Sucursal eliminada correctamente!', { variant: 'success' });
    //     }else{
    //       this.props.enqueueSnackbar(response.data.error, { variant: 'error' });
    //     }
    //   })
    //   .catch(error => ({'error': error}))
    //   .finally( () => {
    //     this.setState({showDialog: false});
    //   });

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

                    <Navbar title={<h1 style={{marginLeft: 20}}> Cajas</h1>} />

                    <Grid style={{marginTop: 20}}>
                        {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to='/dashboard/cashiers/create'>
                                <Button variant="contained" color="primary" endIcon={<IoIosAddCircle/>} > Nueva</Button>
                            </Link>
                        </div> */}
                        <div style={{ marginTop: 30, marginBottom: 50 }}>
                            <Paper >
                              <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell />
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
                                        <Row key={row.id} row={row} />
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

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  // Calcular ingresos y gastos
  var opening_amount = parseFloat(row.opening_amount);
  var income = 0;
  var expenses = 0;
  row.details.map(detail => {
    if(detail.type == 1){
      income += parseFloat(detail.amount);
    }else if(detail.type == 2){
      expenses += parseFloat(detail.amount);
    }
  });

  return (
    <React.Fragment>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}
          </IconButton>
        </TableCell>
        {tableColumns.map((column) => {
          const value = row[column.id];
          return (
            <TableCell key={column.id} align={column.align}>
              {column.format && typeof value === 'number' ? column.format(value) : value}
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Detalle de caja
              </Typography>
              <Table size="small" aria-label="purchases" style={{marginBottom: 30}}>
                <TableHead>
                  <TableRow>
                    <TableCell>Monto de apertura</TableCell>
                    <TableCell>Ingresos</TableCell>
                    <TableCell>Egresos</TableCell>
                    <TableCell>Monto de cierre</TableCell>
                    <TableCell>Faltante</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">{ opening_amount }</TableCell>
                    <TableCell component="th" scope="row">{ income.toFixed(2) }</TableCell>
                    <TableCell component="th" scope="row">{ expenses.toFixed(2) }</TableCell>
                    <TableCell component="th" scope="row"><b>{ (income - expenses + opening_amount).toFixed(2) }</b></TableCell>
                    <TableCell component="th" scope="row">{ row.status == 2 ? <b style={{color: row.missing_amount == 0 ? 'black' :'red'}}>{row.missing_amount}</b> : 'no definido' }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(CashiersList));