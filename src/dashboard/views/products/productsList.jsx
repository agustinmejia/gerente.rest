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
  Slide,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';


import { IoIosMenu, IoIosAddCircle, IoIosCreate, IoIosTrash, IoIosApps } from "react-icons/io";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import axios from "axios";
import Tour from 'reactour';
import { withSnackbar } from 'notistack';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { EmptyList, LoadingList } from "../../components/forms";
import { env } from '../../../env';

const { API, color } = env;
const defaultImg = `${API}/images/default-image.png`;

const transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const tableColumns = [
  { id: 'id', label: 'ID' },
  { id: 'details', label: 'Detalles' },
  { id: 'price', label: 'Precio' },
  { id: 'stock', label: 'Stock' },
  { id: 'actions', label: 'Opciones', align: 'right' },
];

const steps = [
  {
    selector: '.list-step',
    content: 'Lista de productos de tu restaurante con las opciones de edición y eliminación.',
  },
  {
    selector: '.add-step',
    content: 'Presiona para añadir un nuevo producto de tu restaurante.',
  },
  {
    selector: '.stock-step',
    content: 'Opción para agregar el stock de tus productos para llevar un control del mismo por sucursales. Ej: las gaseosas o jugos que vendes en tu restaurante.',
  }
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
          showDialogDelete: false,
          showDialogStock: false,
          tourActive: false,
          loadingList: false,
          loading: false,
          products: [],
          tableRows: [],
          branches: [],
          sidebarToggled: false,
          page: 0,
          rowsPerPage: 10,
          deleteId: 0,
          // form
          selectProductId: null,
          inputStock: 0,
          branchId: 'none',
          open: false
        }
    }

    createData(id, name, type, price, image, description, stock) {
      let details = (
        <>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar src={image ? `${API}/storage/${image.replace('.', '-cropped.')}` : defaultImg} style={{width: 80, height: 80}} />
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                    { name }
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    { description ? description : 'no definida' }
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    { type }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      );
      let tableOptions = (
        <>
          <Link to={`/dashboard/products/${id}/edit`} style={{margin: 5}}>
            <Tooltip title="Editar productos" placement="top">
              <Fab aria-label="Editar productos" size='small'>
                <IoIosCreate size={25} style={{color: color.skyBlue}} />
              </Fab>
            </Tooltip>
          </Link>
          <Tooltip title="Eliminar productos" placement="top">
            <Fab aria-label="Eliminar productos" size='small' onClick={ () => this.setState({ showDialogDelete: true, deleteId: id }) } style={{margin: 5}}>
              <IoIosTrash size={25} style={{color: color.red}} />
            </Fab>
          </Tooltip>
        </>
      )
      return { id, details, price, stock, actions: tableOptions };
    }

    componentDidMount(){
      this.getProducts();

      // Get branches company
      let { company } = this.props.authSession;
      fetch(`${API}/api/company/${company.id}/branches/list`, {headers: this.state.headers})
      .then(res => res.json())
      .then(res => {
          this.setState({branches: res.branches}, () => {
              // Si solo hay una sucursal la seleccionamos por defecto
              if(res.branches.length == 1){
                  this.setState({branchId: res.branches[0].id});
              }
          });
      })
      .catch(error => ({'error': error}));

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      if(urlParams.get('tour') == 1){
        setTimeout(() => {
            this.setState({tourActive: true});
        }, 1500);
      }
    }

    getProducts(){
      this.setState({loadingList: true});
      let { company } = this.props.authSession;
      fetch(`${API}/api/company/${company.id}/products/list`, {headers: this.state.headers})
      .then(res => res.json())
      .then(res => {
        this.renderRowsTable(res.products);
      })
      .catch(error => ({'error': error}))
      .finally(() => this.setState({loadingList: false}));
    }

    renderRowsTable(products){
      if(products){
        let rows = [];
        products.map(product => {
          let stock = 0;
          product.stock.map(item => {
            stock += parseFloat(item.stock);
          });
          rows.push(this.createData(product.id, product.name, product.type, product.price, product.image, product.short_description, stock));
        });
        this.setState({tableRows: rows, products});
      }
    }

    handleselectProductId = (event, value, reason) => {
      if(value){
        this.setState({ selectProductId: value.id });
      }else{
        this.setState({
          selectProductId: null
        });
      }
    }

    handleSubmitStoreStock = async (e) => {
      e.preventDefault();
      let { selectProductId, branchId, inputStock } = this.state;
      if(selectProductId == null || branchId == 'none'){
        this.props.enqueueSnackbar('Debes seleccionar un producto y una sucursal', { variant: 'error' });
        return;
      }

      this.setState({loading: true, showDialogStock: false});

      let { user } = this.props.authSession;
      let params = {
        branch_id: branchId,
        user_id: user.id,
        stock: inputStock
      };

      let res = await axios({
        method: 'post',
        url: `${API}/api/product/${selectProductId}/inventory/store`,
        data: JSON.stringify(params),
        headers: this.state.headers
      })
      .then(res => {
        if(res.data.stock){
            return {stock: res.data.stock};
        }
        return {error: true};
      })
      .catch(error => ({error}))
      .finally(() => this.setState({loading: false, showDialogStock: false}))

      if(res.stock){
        let { stock } = res;

        // Update cashier list
        let { products } = this.state;
        products.map((item, index) => {
          if(item.id == stock[0].product_id){
            products[index].stock = stock;
          }
        });
        this.renderRowsTable(products);

        this.props.enqueueSnackbar('Stock agregado correctamente!', { variant: 'success' });
      }else{
        this.props.enqueueSnackbar('Ocurrió un error inesperado!', { variant: 'error' });
      }
    }

    hanldeDelete = () => {
        let options = {
          headers: this.state.headers
        }
        axios.get(`${API}/api/product/${this.state.deleteId}/delete`, options)
        .then(response => {
          if(response.data.product_id){
            let { product_id } = response.data;

            // Update cashier list
            let { products } = this.state;
            let rows = []
            products.map((item) => {
              if(item.id != product_id){
                rows.push(item);
              }
            });
            this.renderRowsTable(rows);

            this.props.enqueueSnackbar('Sucursal eliminada correctamente!', { variant: 'success' });
          }else{
            this.props.enqueueSnackbar(response.data.error, { variant: 'error' });
          }
        })
        .catch(error => ({'error': error}))
        .finally( () => {
            this.setState({showDialogDelete: false});
        });
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

                    <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> Mis productos</h1>} />

                    <Grid style={{marginTop: 20}}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to='/dashboard/products/create'>
                              <Tooltip title="Crear nuevo producto" placement="top">
                                <Button variant="contained" style={{backgroundColor: color.primary, color: 'white'}} endIcon={<IoIosAddCircle/>} className="add-step" > Crear nuevo</Button>
                              </Tooltip>
                            </Link>
                            <Tooltip title="Agregar inventario de productos" placement="top">
                              <Button variant="contained" onClick={ () => this.setState({showDialogStock: true}) } style={{ backgroundColor: color.secondary, color: 'white', marginLeft: 10 }} endIcon={<IoIosApps/>} className="stock-step" > Inventariar</Button>
                            </Tooltip>
                        </div>
                        
                        <div style={{ marginTop: 30, marginBottom: 50 }}>
                            { this.state.loadingList && <LoadingList /> }
                            { this.state.tableRows.length === 0 && !this.state.loadingList && <EmptyList /> }
                            { this.state.tableRows.length > 0 &&
                              <>
                                <Paper className="list-step">
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
                              </>
                            }
                        </div>
                    </Grid>
                </main>

                {/* Delete dialog */}
                <Dialog
                  open={ this.state.showDialogStock }
                  TransitionComponent={ transition }
                  onClose={ () => this.setState({ showDialogStock: false }) }
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  fullWidth
                  maxWidth='sm'
                >
                  <form onSubmit={ this.handleSubmitStoreStock }>
                    <DialogTitle id="alert-dialog-title">{"Agregar inventario de producto"}</DialogTitle>
                    <DialogContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <Autocomplete
                              id="combo-box-demo"
                              options={ this.state.products }
                              getOptionLabel={(option) => `${option.name} | ${option.type}`}
                              renderInput={(params) => <TextField {...params} label="Seleccione un producto" variant="outlined" />}
                              renderOption={(option, { selected }) => (
                                <React.Fragment>
                                  <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item>
                                      <Avatar src={option.image ? `${API}/storage/${option.image.replace('.', '-cropped.')}` : defaultImg} />
                                    </Grid>
                                    <Grid item xs>
                                        <b>{ option.name }</b>
                                        <br/>
                                        <small>{ option.type } | { option.price } Bs.</small>
                                    </Grid>
                                  </Grid>
                                </React.Fragment>
                              )}
                              noOptionsText='No hay resultados'
                              onChange={ this.handleselectProductId }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextField
                            name="stock"
                            variant="outlined"
                            required
                            fullWidth
                            id="input-stock"
                            label="Stock"
                            placeholder='10'
                            helperText="Cantidad de producto que se desea agregar al stock."
                            value={ this.state.inputStock }
                            inputProps={{ type: 'number', min: '1', step: '1' }}
                            onChange={ event => this.setState({inputStock: event.target.value}) }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} style={{marginBottom: 20}}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Sucursal</InputLabel>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    variant="outlined"
                                    label="Sucursal"
                                    inputProps={{ 'aria-label': 'Sucursal' }}
                                    required
                                    fullWidth
                                    value={ this.state.branchId }
                                    onChange={ event => this.setState({branchId: event.target.value}) }
                                    >
                                      <MenuItem disabled key={0} value="none">
                                          <em>Selecciona la sucursal</em>
                                      </MenuItem>
                                      {
                                        this.state.branches.map(branch => 
                                          <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
                                        )
                                      }
                                </Select>
                            </FormControl>
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={ () => this.setState({ showDialogStock: false }) } >
                        Cancelar
                      </Button>
                      <Button type="submit" style={{ color: color.primary }}>
                        Agregar a inventario
                      </Button>
                    </DialogActions>
                  </form>
                </Dialog>

                {/* Delete dialog */}
                <Dialog
                  open={ this.state.showDialogDelete }
                  TransitionComponent={ transition }
                  onClose={ () => this.setState({ showDialogDelete: false }) }
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
                      <Button onClick={ () => this.setState({ showDialogDelete: false }) } >
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
          </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(ProductsList));