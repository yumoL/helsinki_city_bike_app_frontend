import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { Icon } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
import "leaflet/dist/leaflet.css"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"

import stationService from "../services/station"

const TopStationTable = ({ caption, topStationList }) => {
  if (topStationList.length === 0) return <div></div>
  return (
    <TableContainer component={Paper} style={{ display: "block", width: "100%" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <caption>{caption}</caption>
        <TableHead>
          <TableRow>
            <TableCell>Station name</TableCell>
            <TableCell>Journey count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topStationList.map((s) => (
            <TableRow
              key={s.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">{s.name}</TableCell>
              <TableCell component="th" scope="row">{s.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const StationCard = ({ station }) => {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <React.Fragment>
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
              Station Info
            </Typography>
            <Typography variant="body" component="div">
              Station ID: {station.sid}
            </Typography>
            <Typography variant="body" component="div">
              Name: {station.name}
            </Typography>
            <Typography variant="body" component="div">
              Address: {station.address}
            </Typography>
            <Typography variant="body" component="div">
              Capacity: {station.capacity}
            </Typography>
            <Typography variant="body" component="div">
              Total number of journeys starting from the station: {station.departureCount}
            </Typography>
            <Typography variant="body" component="div">
              Total number of journeys ending at the station: {station.returnCount}
            </Typography>
            <Typography variant="body" component="div">
              The average distance of a journey starting from the station: {station.departureAvgDist}km
            </Typography>
            <Typography variant="body" component="div">
              The average distance of a journey ending at the station: {station.returnAvgDist}km
            </Typography>

          </CardContent>

        </React.Fragment>
      </Card>
    </Box>
  )
}

const StationMap = ({ latitude, longitude, address }) => {
  const position = [latitude, longitude]
  const mapIcon = new Icon({
    iconUrl: icon,
    shadowUtl: iconShadow
  })

  return (
    <MapContainer center={position} zoom={100} scrollWheelZoom={false}
      style={{ width: "50%", height: "calc(100vh - 24rem)", margin: "auto" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={mapIcon}>
        <Popup>
          {address}
        </Popup>
      </Marker>
    </MapContainer>
  )
}


const SingleStation = () => {
  const { sid } = useParams()
  const [station, setStation] = useState(null)
  const [month, setMonth] = useState(0)

  useEffect(() => {
    const fetchStation = async () => {
      const stationInfo = await stationService.getSingleStation(sid, 0)
      setStation(stationInfo)
    }
    fetchStation()
  }, [])

  const handleMonthChange = async (e) => {
    const curMonth = parseInt(e.target.value)
    setMonth(curMonth)
    const stationInfo = await stationService.getSingleStation(sid, curMonth)
    setStation(stationInfo)
  }

  if (!station) return <div></div>

  return (
    <div>
      <Box sx={{ minWidth: 120 }} style={{ margin: "30px" }}>
        <FormControl style={{ "width": "25vw" }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            label="Month"
            onChange={handleMonthChange}
          >
            <MenuItem value={0}>all</MenuItem>
            {[...Array(12).keys()]
              .map(k => <MenuItem key={k} value={k + 1}>{k + 1}</MenuItem>)}

          </Select>
        </FormControl>
      </Box>
      <StationCard station={station} />
      <StationMap latitude={station.y} longitude={station.x} address={station.address} />

      <List>
        <ListItem>
          <TopStationTable
            caption={"Top 5 most popular return stations for journeys starting from the station"}
            topStationList={station.popularReturnStations} />
        </ListItem>
        <ListItem>
          <TopStationTable
            caption={"Top 5 most popular departure stations for journeys ending at the station"}
            topStationList={station.popularDepartureStations} />
        </ListItem>
      </List>

    </div>
  )
}

StationMap.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired
}
StationCard.propTypes = {
  station: PropTypes.object.isRequired
}
TopStationTable.propTypes = {
  caption: PropTypes.string.isRequired,
  topStationList: PropTypes.array.isRequired
}

export default SingleStation