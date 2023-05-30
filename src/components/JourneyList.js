import React, { useState, useEffect } from "react"
import journeyService from "../services/journey"
import stationService from "../services/station"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Pagination from "@mui/material/Pagination"
import TableSortLabel from "@mui/material/TableSortLabel"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import Divider from "@mui/material/Divider"
import MuiInput from "@mui/material/Input"
import { styled } from "@mui/material/styles"
import Button from "@mui/material/Button"
import PropTypes from "prop-types"
import ProgressCircular from "./ProgressCircular"

const Input = styled(MuiInput)`
  width: 70px
`

const headCells = [
  {
    id: "departureStation",
    label: "Departure station"
  },
  {
    id: "returnStation",
    label: "Arrival Station"
  },
  {
    id: "duration",
    label: "Duration (min)"
  },
  {
    id: "distance",
    label: "Distance (km)"
  }
]

const EnhancedTableHead = ({ orderOpt, onRequestSort }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="right"
            padding="normal"
            sortDirection={orderOpt.name === headCell.id ? orderOpt.order : false}
          >
            <TableSortLabel
              active={orderOpt.name === headCell.id}
              direction={orderOpt.name === headCell.id ? orderOpt.order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const FilterInput = ({ title, valueRange, setValueRangeFunc, min, max }) => {
  const handleBlur = () => {
    if (valueRange[0] < min) {
      setValueRangeFunc([min, valueRange[1]])
    } else if (valueRange[1] > max) {
      setValueRangeFunc([valueRange[0], max])
    }
  }

  const handleInputChange = (isFrom) => (event) => {
    let newRange = []
    if (isFrom) {
      newRange = [event.target.value, valueRange[1]]
    } else {
      newRange = [valueRange[0], event.target.value]
    }
    setValueRangeFunc(newRange)
  }

  return (
    <div>
      <Typography>{title}</Typography>
      <InputLabel>From</InputLabel>
      <Input
        value={valueRange[0]}
        size="small"
        onChange={handleInputChange(true)}
        onBlur={handleBlur}
        inputProps={{
          step: 10,
          min: { min },
          max: { max },
          type: "number"
        }}
      />
      <InputLabel>To</InputLabel>
      <Input
        value={valueRange[1]}
        size="small"
        onChange={handleInputChange(false)}
        onBlur={handleBlur}
        inputProps={{
          step: 10,
          min: { min },
          max: { max },
          type: "number"
        }}
      />
    </div>

  )
}

const FilterSelection = ({ inputLabel, stations, currStation, setCurrStation }) => {
  const handleChange = (event) => {
    setCurrStation(event.target.value)
  }
  return (
    <div>
      <FormControl>
        <InputLabel>{inputLabel}</InputLabel>
        <Select
          value={currStation}
          label={inputLabel}
          onChange={handleChange}
          autoWidth={true}
        >
          <MenuItem value={-1}>All</MenuItem>
          {stations.map(s =>
            <MenuItem key={s.sid} value={s.sid}>{s.name}</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  )
}

const JourneyList = () => {
  const [journeys, setJourneys] = useState([])
  const [pageCount, setPageCount] = useState(1)
  const [orderOpt, setOrderOpt] = useState({})
  const [stations, setStations] = useState([])
  const [distanceRange, setDistanceRange] = useState([0, 0])
  const [durationRange, setDurationRange] = useState([0, 0])
  const [defaultDistanceRange, setDefaultDistanceRange] = useState([0, 0])
  const [defaultDurationRange, setDefaultDurationRange] = useState([0, 0])
  const [departureStationId, setDepartureStationId] = useState(-1)
  const [returnStationId, setReturnStationId] = useState(-1)
  const [currPage, setCurrPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const parseOrderOpt = () => {
    const order = orderOpt.name ? {
      name: orderOpt.name,
      order: orderOpt.order === "desc" ? 0 : 1
    } : null
    return order
  }

  const parseWhereOpt = () => {
    if (isFilterInputError) return null
    let where = {
      duration: {
        min: Number(durationRange[0]) * 60,
        max: Number(durationRange[1]) * 60
      },
      distance: {
        min: Number(distanceRange[0]) * 1000,
        max: Number(distanceRange[1]) * 1000
      }
    }
    if (departureStationId !== -1) {
      where["departureStationId"] = {
        val: departureStationId
      }
    }
    if (returnStationId !== -1) {
      where["returnStationId"] = {
        val: returnStationId
      }
    }
    return where
  }

  const fetchJourneyList = async (pageIndex) => {
    setLoading(true)
    const res = await journeyService.getJourneyList(
      {
        pageIndex: pageIndex,
        order: parseOrderOpt(),
        where: parseWhereOpt()
      }
    )
    setJourneys(res.journeyList)
    setPageCount(Math.ceil(res.count / res.pageSize))
    setCurrPage(pageIndex + 1)
    setLoading(false)
  }

  const handleChangePage = async (event, newPage) => {
    await fetchJourneyList(newPage - 1)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderOpt.name === property && orderOpt.order === "asc"
    setOrderOpt({
      name: property,
      order: isAsc ? "desc" : "asc"
    })
  }

  const isFilterInputError = (durationRange[0] > durationRange[1]) ||
    (distanceRange[0] > distanceRange[1])

  const handleFilterFormSubmit = async (event) => {
    event.preventDefault()
    await fetchJourneyList(0)
  }

  const onCleanFilterButtonClick = () => {
    setDurationRange(defaultDurationRange)
    setDistanceRange(defaultDistanceRange)
    setDepartureStationId(-1)
    setReturnStationId(-1)
  }

  useEffect(() => {
    const fetchAllStations = async () => {
      const stationListData = await stationService.getStationList("", "all")
      setStations(stationListData.stationList)
    }
    const fetchJourneyOverview = async () => {
      const journeyOverview = await journeyService.getJourneyOverview()
      const { minDuration, maxDuration, minDistance, maxDistance } = journeyOverview
      setDurationRange([minDuration, maxDuration])
      setDefaultDurationRange([minDuration, maxDuration])
      setDistanceRange([minDistance, maxDistance])
      setDefaultDistanceRange([minDistance, maxDistance])
    }
    fetchAllStations()
    fetchJourneyOverview()
  }, [])


  useEffect(() => {
    fetchJourneyList(0)
  }, [orderOpt])

  return (
    <div>
      {/* filter */}
      <form onSubmit={handleFilterFormSubmit}>
        <Box sx={{ flexGrow: 1, margin: "20px 10px" }}>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <FilterInput
                title={"Duration (min)"}
                valueRange={durationRange}
                setValueRangeFunc={setDurationRange}
                min={defaultDurationRange[0]}
                max={defaultDurationRange[1]}
              />
            </Grid>
            <Grid item xs={2}>
              <FilterInput
                title={"Distance (km)"}
                valueRange={distanceRange}
                setValueRangeFunc={setDistanceRange}
                min={defaultDistanceRange[0]}
                max={defaultDistanceRange[1]}
              />
            </Grid>
            <Grid item xs={4}>
              <FilterSelection
                inputLabel="Departure station"
                stations={stations}
                currStation={departureStationId}
                setCurrStation={setDepartureStationId}
              />
            </Grid>
            <Grid item xs={4}>
              <FilterSelection
                inputLabel="Arrival station"
                stations={stations}
                currStation={returnStationId}
                setCurrStation={setReturnStationId}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFilterInputError}
          >
            Search
          </Button>
          <Button
            type="button"
            onClick={onCleanFilterButtonClick}
            variant="contained"
            color="secondary"
            disabled={isFilterInputError}
            style={{ marginLeft: "15px" }}
          >
            Clean filter
          </Button>

        </Box>
      </form>
      <Divider style={{ marginTop: "15px" }} />

      {/* Journey table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <EnhancedTableHead
            orderOpt={orderOpt}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {journeys.map((journey) => (
              <TableRow
                key={journey.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">
                  {journey["departureStation"]}
                </TableCell>
                <TableCell align="right">{journey["returnStation"]}</TableCell>
                <TableCell align="right">{journey["duration"]}</TableCell>
                <TableCell align="right">{journey["distance"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProgressCircular loading={loading} />

      <Pagination
        style={{ marginTop: "15px" }}
        count={pageCount}
        page={currPage}
        color="primary"
        onChange={handleChangePage}
      />
    </div>
  )
}

EnhancedTableHead.propTypes = {
  orderOpt: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired
}

FilterInput.propTypes = {
  title: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  valueRange: PropTypes.array.isRequired,
  setValueRangeFunc: PropTypes.func.isRequired,
}

FilterSelection.propTypes = {
  inputLabel: PropTypes.string.isRequired,
  stations: PropTypes.array.isRequired,
  currStation: PropTypes.number.isRequired,
  setCurrStation: PropTypes.func.isRequired
}

export default JourneyList