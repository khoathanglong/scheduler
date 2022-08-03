import { TextField, Box, Typography, Alert } from "@mui/material"
import { LoadingButton } from "@mui/lab"

import { useState } from "react"
import { login } from "../services"
import { useRouter } from "next/router"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return // prevent user from submitting multiple times

    setIsLoading(true)
    const response = await login(email, password).catch(() => setError(true))
    if (response) {
      const { bearer_token } = response.data.data
      localStorage.setItem("bearer_token", bearer_token)
      router.push("/")
    }
    setIsLoading(false)
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={isLoading}
        >
          Sign In
        </LoadingButton>

        {error && (
          <Alert color="error">
            Username or password is not correct, please try again
          </Alert>
        )}
      </Box>
    </Box>
  )
}
