import {createRoot} from 'react-dom/client';
import {Provider} from "react-redux";
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';

import {store} from "./redux";
import App from "./App";

import theme from './theme';

const container = document.getElementById('root');
if (!container) {
  throw new Error(
    'Контейнер root не найден. НЕ удалось вмонтировать реакт приложение',
  );
}

createRoot(container).render(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <App/>
    </ThemeProvider>
  </Provider>,
);
