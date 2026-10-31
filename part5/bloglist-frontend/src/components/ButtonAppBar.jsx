import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

export default function ButtonAppBar({ user, handleLogout }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Blog App</Typography>
          <Button color="inherit" component={Link} to="/" sx={style}>blogs</Button>
          {
            user ?
              (
                <>
                  <Button color="inherit" component={Link} to="/create" sx={style}>new blog</Button>
                  <Button color="inherit" onClick={handleLogout} sx={style}>logout</Button>
                </>
              )
              :
              <Button color="inherit" component={Link} to="/login" sx={style}>login</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}