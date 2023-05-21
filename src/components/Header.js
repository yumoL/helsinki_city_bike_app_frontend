import React from "react"
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

const linkStyle = {
  textDecoration: "none",
  color: "white"
}
const Header = () => {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Link style={linkStyle} to="/">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >

                HSL Bike App
              </IconButton>
            </Link>

            <Typography variant="h6" sx={{ mr: 2 }} >
              <Link
                style={linkStyle}
                to="/stations">
                Stations
              </Link>
            </Typography>
            <Typography variant="h6" sx={{ mr: 2 }}>
              <Link
                style={linkStyle}
                to="/journeys">
                Journeys
              </Link>
            </Typography>
            <Typography variant="h6">
              <Link
                style={linkStyle}
                to="/upload">
                Upload Data
              </Link>
              {/* <Button component={Link} to="/upload">
                Upload Data
              </Button> */}

            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
}

export default Header