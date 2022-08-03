import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Container } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    secondary: {
      main: "#6366F1",
    },
    success: {
      main: "#059669",
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Component {...pageProps} />
      </Container>
    </ThemeProvider>
  )
}

export default MyApp
