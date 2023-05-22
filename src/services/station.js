import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_BACKEND}/api/station`

const uploadStationFile = async formData => {
  const res = await axios.post(`${baseUrl}/upload`, formData)
  return res.data
}

const getStationList = async (pageIndex = 0) => {
  const res = await axios.get(`${baseUrl}/all/${pageIndex}`)
  return res.data.data
}
export default {
  uploadStationFile,
  getStationList
}