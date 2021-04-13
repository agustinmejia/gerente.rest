import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';
import { Provider } from 'react-redux'
import store from './store';
import SimpleReactLightbox from 'simple-react-lightbox';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SimpleReactLightbox>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </SimpleReactLightbox>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
