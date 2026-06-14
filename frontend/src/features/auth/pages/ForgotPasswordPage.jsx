import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { resetPassword, clearError } from '../authSlice';
import { validate, isRequired, isEmail } from '../../../utils/validators';

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const { resetSent, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors: errs, valid } = validate({ email }, { email: [isRequired, isEmail] });
    setErrors(errs);
    if (valid) dispatch(resetPassword(email));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Reset Password</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your email and we will send you a password reset link.
          </Typography>
          {resetSent && <Alert severity="success" sx={{ mb: 2 }}>Reset link sent. Check your inbox.</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>{error}</Alert>}
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth label="Email" type="email" value={email}
              error={!!errors.email} helperText={errors.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Send Reset Link</Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">Back to login</Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
