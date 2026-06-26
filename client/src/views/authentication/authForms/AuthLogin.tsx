import React, { FormEvent, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { getAuthErrorMessage, useAuth } from 'src/context/AuthContext';
import { loginType } from 'src/types/auth/auth';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h3" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    {error ? (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    ) : null}

    <Box component="form" onSubmit={handleSubmit} mt={3}>
      <Stack>
        <Box>
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomTextField
            id="email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </Box>
      </Stack>
      <Box mt={3}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={submitting}
        >
          Sign In
        </Button>
      </Box>
    </Box>
    {subtitle}
  </>
  );
};

export default AuthLogin;
