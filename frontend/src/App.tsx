import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

// Layout Components
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import SetlistList from './pages/setlists/SetlistList';
import SetlistDetail from './pages/setlists/SetlistDetail';
import SetlistBuilder from './pages/setlists/SetlistBuilder';
import SongLibrary from './pages/songs/SongLibrary';
import SongDetail from './pages/songs/SongDetail';
import BandList from './pages/bands/BandList';
import BandDetail from './pages/bands/BandDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/profile/Profile';
import Settings from './pages/profile/Settings';
import NotFound from './pages/NotFound';
import PerformanceMode from './pages/performance/PerformanceMode';

// Redux Actions & Selectors
import { checkAuth } from './store/slices/authSlice';
import { RootState, AppDispatch } from './store';

// Route Guards
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
      </Route>
      
      {/* Private Routes */}
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        {/* Setlist Routes */}
        <Route
          path="/setlists"
          element={
            <PrivateRoute>
              <SetlistList />
            </PrivateRoute>
          }
        />
        <Route
          path="/setlists/:id"
          element={
            <PrivateRoute>
              <SetlistDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/setlists/:id/edit"
          element={
            <PrivateRoute>
              <SetlistBuilder />
            </PrivateRoute>
          }
        />
        <Route
          path="/setlists/new"
          element={
            <PrivateRoute>
              <SetlistBuilder />
            </PrivateRoute>
          }
        />
        
        {/* Song Routes */}
        <Route
          path="/songs"
          element={
            <PrivateRoute>
              <SongLibrary />
            </PrivateRoute>
          }
        />
        <Route
          path="/songs/:id"
          element={
            <PrivateRoute>
              <SongDetail />
            </PrivateRoute>
          }
        />
        
        {/* Band Routes */}
        <Route
          path="/bands"
          element={
            <PrivateRoute>
              <BandList />
            </PrivateRoute>
          }
        />
        <Route
          path="/bands/:id"
          element={
            <PrivateRoute>
              <BandDetail />
            </PrivateRoute>
          }
        />
        
        {/* User Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
      </Route>
      
      {/* Performance Mode (Minimal UI) */}
      <Route
        path="/perform/:id"
        element={
          <PrivateRoute>
            <PerformanceMode />
          </PrivateRoute>
        }
      />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;