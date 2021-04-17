const reducerApp = (
        state = {
            authSession: {},
            globalConfig: {
                sidebar: {
                    collapsed: false,
                    toggled: ''
                },
                TPVSales:{
                    productsShowType: 'cuadricula'
                },
                help: {
                    tour: true,
                    tips: true,
                }
            },
            productsTPV: []
        }, action
    ) => {
    switch (action.type) {
        case 'SET_AUTH_SESSION':
            return {...state, authSession: action.payload};
        case 'SET_GLOBAL_CONFIG':
            return {...state, globalConfig: action.payload};
        case 'SET_PRODUCTS_TPV':
            return {...state, productsTPV: action.payload};
        default:
            return state;
    }
}

export default reducerApp;