const reducerApp = (
        state = {
            authSession: {},
            sidebarConfig: {
                collapsed: false,
                toggled: ''
            }
        }, action
    ) => {
    switch (action.type) {
        case 'SET_AUTH_SESSION':
            return {...state, authSession: action.payload};
        case 'SET_SIDEBAR_CONFIG':
            return {...state, sidebarConfig: action.payload};
        default:
            return state;
    }
}

export default reducerApp;