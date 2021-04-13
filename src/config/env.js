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