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
        primary: '#2a95a5',
        textMuted: '#6A6969',
    },
    images: {
        banner: { uri: 'https://livemedic.net/storage/blocks/October2020/Pvno9mFgGRY7RJ3a2i9xxycTAVZog4Thh18MejRc.png' }
    },
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