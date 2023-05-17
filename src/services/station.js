import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_BACKEND}/api/station`

const uploadStationFile = async formData => {
  const res = await axios.post(`${baseUrl}/upload`, formData)
  console.log('return', res)
  return res.data
}

export default {
  uploadStationFile
}