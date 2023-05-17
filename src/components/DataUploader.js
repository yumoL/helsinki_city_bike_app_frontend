import React, { useState } from "react"
import Button from "@mui/material/Button"
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import MuiAlert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import stationService from "../services/station"
import journeyService from "../services/journey"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const DataUploader = () => {
  const STATION_TYPE = "station"
  const JOURNEY_TYPE = "journey"
  const [loading, setLoading] = useState(false)
  const [alertOpen, setAlertOpen] = React.useState(false)

  const handleFileChange = type => async event => {
    const file = event.target.files[0]
    let formData = new FormData()
    formData.append("file", file)
    setLoading(true)
    if (type === STATION_TYPE) {
      await stationService.uploadStationFile(formData)
    } else if (type === JOURNEY_TYPE) {
      await journeyService.uploadJourneyFile(formData)
    }
    setLoading(false)
    setAlertOpen(true)
    //setNotification("Your file has been successfully uploaded.")
  }

  const handleAlertClose = () => {
    setAlertOpen(false)
  }

  return (
    <div>
      <Button variant="contained" component="label" color="secondary" sx={{ mt: 2 }}>
        Upload Stations
        <input type="file" accept=".csv" hidden onChange={handleFileChange(STATION_TYPE)} />
      </Button>
      <Button variant="contained" component="label" color="success" sx={{ mt: 2, ml: 3 }}>
        Upload Journeys
        <input type="file" accept=".csv" hidden onChange={handleFileChange(JOURNEY_TYPE)} />
      </Button>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '60%' }}>
          Your file has been successfully uploaded
        </Alert>
      </Snackbar>
    </div>
  )
}

export default DataUploader