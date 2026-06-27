import { useContext } from 'react';
import { SWRConfig } from 'swr';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { swrConfig } from './hooks/useApi';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import router from './routes/Router';

function App() {
  const theme = ThemeSettings();
  const { activeDir } = useContext(CustomizerContext);

  return (
    <SWRConfig value={swrConfig}>
      <ThemeProvider theme={theme}>
        <RTL direction={activeDir}>
          <CssBaseline />
          <RouterProvider router={router} />
        </RTL>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default App;
