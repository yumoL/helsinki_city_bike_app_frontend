import React, { useEffect, useState } from "react"
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Pagination from '@mui/material/Pagination'

import stationService from "../services/station"

const StationList = () => {
  const [stations, setStations] = useState([])
  const [pageCount, setPageCount] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const fetchStationList = async () => {
      const res = await stationService.getStationList(0)
      setStations(res.stationList)
      setPageCount(Math.floor(res.count / pageSize))
    }
    fetchStationList()
  }, [])

  const handleChangePage = async(event, newPage) => {
    const res = await stationService.getStationList(newPage)
    setStations(res.stationList)
  }


  return (
    <div style={{ margin: "20px" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Station ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Address</TableCell>
              <TableCell align="right">City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.map((station) => (
              <TableRow
                key={station.sid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {station.sid}
                </TableCell>
                <TableCell align="right">{station.name}</TableCell>
                <TableCell align="right">{station.address}</TableCell>
                <TableCell align="right">{station.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination 
        style={{ marginTop: "15px" }} 
        count={pageCount} 
        color="primary" 
        onChange={handleChangePage}
      />
    </div>
  )
}

export default StationList