import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF", // WHITE COLOR
    },
    secondary: {
      main: "#FBAF1A", // YELLOW COLOR
      
    },
    accent: {
      white: "#FFFFFF", // white COLOR
      black: "#000000", // black color
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 950,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "Roboto Slab",
    fontWeightRegular:"400",
    fontWeightMedium:"500",
    fontWeightSemiBold:"600",
    fontWeightBold:"700"
  },
});

export default theme;