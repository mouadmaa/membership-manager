import React, { FormEvent, useState } from 'react';
import { Box, Typography, Button, Stack, Alert } from '@mui/material';
import { useNavigate } from 'react-router';
import { getAuthErrorMessage, useAuth } from 'src/context/AuthContext';
import { registerType } from 'src/types/auth/auth';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        national_id: nationalId,
        phone: phone || undefined,
      });
      navigate('/member/dashboard');
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
      <Stack mb={3}>
        <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
        <CustomTextField
          id="name"
          variant="outlined"
          fullWidth
          required
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
        <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
        <CustomTextField
          id="email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
        <CustomTextField
          id="password"
          type="password"
          variant="outlined"
          fullWidth
          required
          inputProps={{ minLength: 8 }}
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        <CustomFormLabel htmlFor="national_id">National ID</CustomFormLabel>
        <CustomTextField
          id="national_id"
          variant="outlined"
          fullWidth
          required
          value={nationalId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNationalId(e.target.value)}
        />
        <CustomFormLabel htmlFor="phone">Phone (optional)</CustomFormLabel>
        <CustomTextField
          id="phone"
          variant="outlined"
          fullWidth
          value={phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
        />
      </Stack>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="submit"
        disabled={submitting}
      >
        Sign Up
      </Button>
    </Box>
    {subtitle}
  </>
  );
};

export default AuthRegister;
