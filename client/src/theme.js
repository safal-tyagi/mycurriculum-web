import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#876caf',
        },
        secondary: {
            main: '#afb3c6',
        },
        error: {
            main: '#ff0000',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export default theme;
