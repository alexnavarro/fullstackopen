import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="standard-basic"
            label="username"
            variant="standard"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <TextField
            id="standard-password-input"
            label="password"
            type="password"
            autoComplete="current-password"
            variant="standard"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {/* <div>
          <label>
          username
            <input
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div> */}
        {/* <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div> */}
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm