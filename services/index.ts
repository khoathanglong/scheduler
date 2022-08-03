import axios from "axios"
import { format, getDay, getMonth } from "date-fns"
import { Scheduler } from "../components/Schedulers"
const MONTH_LIST = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
]
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const api = axios.create({
  baseURL: "https://test-project.knowork.xyz/api/public/",
})

api.interceptors.request.use(
  (config) => {
    if (config.headers === undefined) {
      config.headers = {}
    }
    config.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "bearer_token"
    )}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

interface LoginResponse {
  data: {
    bearer_token: string
  }
}

export interface SchedulersAndWorkOptions {
  schedulers: Scheduler[]
  workOptions: WorkOption[]
}

export interface WorkOption {
  id: number
  name: string
}

const login = (email: string, password: string) =>
  api.post<LoginResponse>("login", { email, password })

const checkIn = (scheduleId: number) =>
  api.post("scheduler/check-in", { schedule_entry_id: scheduleId })

const saveWorkOption = (date: string, workOptionId: number) =>
  api.post("scheduler", { schedule_option_id: workOptionId, date })

const getEvents = (rawDate: string) => api.get(`events?date=${rawDate}`)

const getScheduleList = async () => {
  const today = format(new Date(), "yyyy-MM-dd")
  const response = await Promise.all([
    api.get("options"),
    api.get(`scheduler?week_start=${today}`),
  ]).catch((error) => {
    throw new Error(error)
  })
  if (response) {
    const workOptions = response[0].data.data
    const rawSchedulers = response[1].data.data

    const schedulers = Object.keys(rawSchedulers).map((rawDate: string) => {
      const currentScheduler = rawSchedulers[rawDate][0]
      const date = rawDate.slice(8)
      const month = MONTH_LIST[getMonth(new Date(rawDate))]
      const dayName = DAYS[getDay(new Date(rawDate))]

      if (!currentScheduler)
        return {
          rawDate,
          dayName,
          date,
          month,
          id: 0,
          savedWorkOption: { id: null, name: "" },
          checkedIn: false,
        }
      const savedWorkOption = workOptions.find(
        (option: WorkOption) =>
          option.id === currentScheduler.schedule_option_id
      )
      return {
        id: currentScheduler.id || 0,
        savedWorkOption,
        checkedIn: !!currentScheduler.checked_in,
        dayName,
        date,
        rawDate,
        month,
      }
    })

    return { schedulers, workOptions }
  }
  return { schedulers: [], workOptions: [] }
}

export { login, getScheduleList, saveWorkOption, checkIn, getEvents }
