import { useEffect } from 'react';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import AppHeader from './components/AppHeader';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Login from './login/Page';
import Register from './register/Page';
import { AppStyles } from './App.styles';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './dashboard/Page';
import { useGetAuthenticatedUser, usePersistUser } from './services/Auth.Service';

function App() {
  const user = useGetAuthenticatedUser();
  usePersistUser(user);

  useEffect(() => {
    document.title = "WebApp Boilerplate App";
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <AppHeader isAuthenticated={user !== null}/>
          <Box sx={AppStyles.mainContainer}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    isAuthenticated={user !== null}
                    outlet={<Dashboard />}
                  />
                }
              />
            </Routes>
          </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}


export default App;
