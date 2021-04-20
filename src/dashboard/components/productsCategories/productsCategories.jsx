import React from 'react';
import {
    Grid,
    Button,
    TextField,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
}from '@material-ui/core';
import { IoIosCamera, IoIosAddCircleOutline } from "react-icons/io";

import { env } from '../../../env';
const { color } = env;

const ProductsCategories = (props) => {
    return(
        <Dialog
            open={ props.showDialogCreateCategory }
            onClose={ props.onClose }
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title"><IoIosAddCircleOutline size={20}/> Nueva categoría</DialogTitle>
            <DialogContent>
                <>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            variant="outlined"
                            required
                            fullWidth
                            autoFocus
                            error={ props.errorCreateCategory }
                            id="input-name-category"
                            label="Nombre"
                            placeholder='Pizzas'
                            helperText="Nombre descriptivo de la categoría"
                            value={ props.inputNameCategory }
                            onChange={ props.setInputNameCategory }
                            style={{ marginBottom: 15 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="input-description-category"
                            label="Descripción"
                            placeholder='Descripción corta de la categería'
                            name="description"
                            helperText="Ej: Las mejores pizzas caseras del mercado."
                            value={ props.inputDescriptionCategory }
                            onChange={ props.setInputDescriptionCategory }
                            style={{ marginBottom: 15 }}
                            multiline
                            rows={2}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input type="file" style={{ display: 'none' }} id="input-image-category" name="image" accept="image/*" onChange={ props.hanldeImageCategory }/>
                        <label htmlFor="input-image-category">
                            <Tooltip title="Click para cambiar imagen" placement="top">
                                <IconButton aria-label="Click para cambiar imagen" component="span">
                                    <IoIosCamera size={70} color="grey" />
                                </IconButton>
                            </Tooltip>
                        </label>
                        <img src={ props.imageCategory } style={{ marginLeft: 20, height: 100, border: '3px solid #E2E3E3' }} alt=""/>
                    </Grid>
                </>
            </DialogContent>
            <DialogActions>
                <Button onClick={ props.onClose } >
                    Cancelar
                </Button>
                <Button onClick={ props.handleSubmitCategory } style={{color: color.primary}}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductsCategories;