export const env = {
    appName: "Gerente.rest",
    appDescription: "",
    autor: "@AgustinMejiaM",
    API: "http://localhost:8000",
    SOCKET_IO: "http://127.0.0.1:3001",
    location: {
        latitude: -14.834821,
        longitude: -64.904159,
    },
    color: {
        primary: '#28B463',
        primaryAlt: '40, 180, 99',
        secondary: '#212F3C',
        secondaryAlt: '33, 47, 60',
        red: '#E74C3C',
        violeta: '#8E44AD',
        blue: '#236DCC',
        skyBlue: '#09ABE1',
        green: '#28B463',
        yellow: '#F1C40F',
        orange: '#E67E22',
        white: '#FDFEFE',
        gray: '#95A5A6',
        black: '#17202A'
    },
    services: {
        googleMaps: '',
        googleOAuth: '',
        facebookOAuth: '',
    }
}

export const strRandom = (length) => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}