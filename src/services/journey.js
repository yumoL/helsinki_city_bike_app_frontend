import axios from "axios"

const baseUrl = `${process.env.REACT_APP_BACKEND}/api/journey`

const uploadJourneyFile = async formData => {
  const res = await axios.post(`${baseUrl}/upload`, formData)
  console.log("return", res)
  return res.data
}

const getJourneyList = async ({ pageIndex = 0, order, where }) => {
  const res = await axios.post(`${baseUrl}/all/${pageIndex}`, { order, where })
  return res.data.data
}

const getJourneyOverview = async () => {
  const res = await axios.get(`${baseUrl}/overview`)
  return res.data.data
}

export default {
  uploadJourneyFile,
  getJourneyList,
  getJourneyOverview
}