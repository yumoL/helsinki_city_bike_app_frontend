import React from "react"
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

const Header = () => {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              HSL Bike App
            </IconButton>
            <Typography variant="h6" sx={{ mr: 2 }} >
              Stations
            </Typography>
            <Typography variant="h6" sx={{ mr: 2 }}>
              Journeys
            </Typography>
            <Typography variant="h6">
              Upload Data
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
}

export default Header