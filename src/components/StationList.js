import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Pagination from "@mui/material/Pagination"

import SearchBar from "./SearchBar"
import stationService from "../services/station"
import { useDebounce } from "../hooks/useDebounce"


const StationList = () => {
  const [stations, setStations] = useState([])
  const [pageCount, setPageCount] = useState(1)
  const [keyword, setKeyword] = useState("")
  const debouncedKeyword = useDebounce(keyword)

  useEffect(() => {
    const fetchStationList = async () => {
      const res = await stationService.getStationList(debouncedKeyword, 0)
      setStations(res.stationList)
      setPageCount(Math.ceil(res.count / res.pageSize))
    }
    fetchStationList()
  }, [])

  useEffect(() => {
    if (debouncedKeyword || debouncedKeyword === "") {
      const fetchStationListBykeyword = async () => {
        const res = await stationService.getStationList(debouncedKeyword, 0)
        setStations(res.stationList)
        setPageCount(Math.ceil(res.count / res.pageSize))
      }
      fetchStationListBykeyword()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword])

  const handleChangePage = async (event, newPage) => {
    console.log("new page", newPage)
    const res = await stationService.getStationList(debouncedKeyword, newPage-1)
    setStations(res.stationList)
  }

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value)
  }


  return (
    <div style={{ margin: "20px" }}>
      <SearchBar handleInputChange={handleKeywordChange} />
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
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Link to={`/station/${station.sid}`}>
                    {station.sid}
                  </Link>
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