import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard';
import ManageVariety from './components/ManageVariety';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32', // Green shade for agricultural theme
    },
    secondary: {
      main: '#ff8f00', // Orange shade for contrast
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/manage",
    element: <ManageVariety />,
  },
  {
    path: "/manage/:id",
    element: <ManageVariety />,
  },
]);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
