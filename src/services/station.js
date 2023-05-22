import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_BACKEND}/api/station`

const uploadStationFile = async formData => {
  const res = await axios.post(`${baseUrl}/upload`, formData)
  return res.data
}

const getStationList = async (keyword, pageIndex = 0) => {
  let params = {}
  if (keyword && keyword.length > 0) {
    params = {
      keyword
    }
  }
  const res = await axios.get(`${baseUrl}/all/${pageIndex}`, {
    params
  })
  return res.data.data
}
export default {
  uploadStationFile,
  getStationList
}