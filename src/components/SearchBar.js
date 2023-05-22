import React from "react"
import PropTypes from "prop-types"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"
import TextField from "@mui/material/TextField"

const SearchBar = ({ handleInputChange }) => {
  return (
    <div>
      <TextField
        id="search-bar"
        label="Enter a station name"
        variant="outlined"
        placeholder="Search..."
        size="small"
        onInput={handleInputChange}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "blue" }} />
      </IconButton>
    </div>
  )
}

SearchBar.propTypes = {
  handleInputChange: PropTypes.func.isRequired
}

export default SearchBar