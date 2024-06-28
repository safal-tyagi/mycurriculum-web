import React from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

const Login = () => {
  return (
    <Container maxWidth="xs">
      <Typography variant="h4">Login</Typography>
      <form>
        <TextField label="Username" variant="outlined" fullWidth margin="normal" />
        <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />
        <Button type="submit" variant="contained" fullWidth>Login</Button>
      </form>
    </Container>
  );
};

export default Login;
