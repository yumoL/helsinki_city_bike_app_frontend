import axios from "axios"

const baseUrl = `${process.env.REACT_APP_BACKEND}/api/journey`

const uploadJourneyFile = async formData => {
  const res = await axios.post(`${baseUrl}/upload`, formData)
  console.log("return", res)
  return res.data
}

export default {
  uploadJourneyFile
}