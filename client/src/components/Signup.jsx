import React from 'react';
import { TextField, Button, Container, Typography, Grid, Checkbox, FormControlLabel } from '@mui/material';

const Signup = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Signup</Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="First Name" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Last Name" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Username" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" type="password" variant="outlined" fullWidth />
          </Grid>
          {/* Continue adding other fields in a similar manner */}
        </Grid>
        <Button type="submit" variant="contained" fullWidth style={{ marginTop: '1rem' }}>Signup</Button>
      </form>
    </Container>
  );
};

export default Signup;
