const reducerApp = (
        state = {
            authSession: {},
            globalConfig: {
                sidebar: {
                    collapsed: false,
                    toggled: ''
                }
            }
        }, action
    ) => {
    switch (action.type) {
        case 'SET_AUTH_SESSION':
            return {...state, authSession: action.payload};
        case 'SET_GLOBAL_CONFIG':
            return {...state, globalConfig: action.payload};
        default:
            return state;
    }
}

export default reducerApp;