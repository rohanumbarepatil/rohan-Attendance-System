import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert, Link, CircularProgress,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { login, clearError } from '../authSlice';
import { validate, isRequired, isEmail, minLength } from '../../../utils/validators';

export default function LoginPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, profile, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  if (user && profile) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors: errs, valid } = validate(form, {
      email: [isRequired, isEmail],
      password: [isRequired, minLength(6)],
    });
    setErrors(errs);
    if (valid) dispatch(login(form));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h5">College Attendance Management</Typography>
            <Typography variant="body2" color="text.secondary">Sign in to your account</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>{error}</Alert>}
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth label="Email" type="email" margin="normal" value={form.email}
              error={!!errors.email} helperText={errors.email} autoComplete="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              fullWidth label="Password" type="password" margin="normal" value={form.password}
              error={!!errors.password} helperText={errors.password} autoComplete="current-password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">Forgot password?</Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
