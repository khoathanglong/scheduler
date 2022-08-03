import {
  checkIn,
  getEvents,
  getScheduleList,
  SchedulersAndWorkOptions,
  WorkOption,
} from "../services"
import { useState, useEffect, useCallback } from "react"
import { Scheduler } from "../components/Schedulers"
import { saveWorkOption } from "../services"
import { Event } from "../components/Events"

interface UseSchedulers {
  error: boolean
  isLoading: boolean
  setSchedulers: (schedulers: Scheduler[]) => void
}

export const useSchedulers = (): UseSchedulers & SchedulersAndWorkOptions => {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [schedulers, setSchedulers] = useState<Scheduler[]>([])
  const [workOptions, setWorkOptions] = useState<WorkOption[]>([])

  useEffect(() => {
    setIsLoading(true)
    getScheduleList()
      .then(({ schedulers, workOptions }) => {
        setWorkOptions(workOptions)
        setSchedulers(schedulers)
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [])

  return { isLoading, schedulers, error, workOptions, setSchedulers }
}

interface UseSaveWorkOption {
  error: boolean
  isLoading: boolean
  scheduler: Partial<Scheduler>
  handleSaveWorkOption: (rawDate: string, workOption: WorkOption) => void
}
export const useSaveWorkOption = (): UseSaveWorkOption => {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [scheduler, setScheduler] = useState<Partial<Scheduler>>({})

  const handleSaveWorkOption = useCallback(
    async (rawDate: string, workOption: WorkOption) => {
      setIsLoading(true)
      const res = await saveWorkOption(rawDate, workOption.id).catch((e) => {
        console.log(e)
        setError(true)
      })
      if (res) {
        setScheduler({
          rawDate,
          id: res.data.id,
          savedWorkOption: workOption,
        })
      }
      setIsLoading(false)
    },
    []
  )

  return { isLoading, error, scheduler, handleSaveWorkOption }
}

interface UseCheckin {
  error: boolean
  isLoading: boolean
  scheduler: Partial<Scheduler>
  handleCheckIn: (scheduleId: number) => void
}
export const useCheckin = (): UseCheckin => {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [scheduler, setScheduler] = useState<Partial<Scheduler>>({})

  const handleCheckIn = useCallback(async (scheduleId: number) => {
    setIsLoading(true)
    const res = await checkIn(scheduleId).catch((e) => {
      console.log(e)
      setError(true)
    })
    if (res) {
      setScheduler({
        id: scheduleId,
      })
    }
    setIsLoading(false)
  }, [])

  return { isLoading, error, scheduler, handleCheckIn }
}

interface UseEvents {
  events: Event[]
  isLoading: boolean
}
export const useEvents = (rawDate: string): UseEvents => {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getEvents(rawDate)
      .then((res) => {
        const mappedEvents: Event[] = res.data.data.map(
          (event: any, index: number) => {
            return {
              id: event.id,
              starts: event.starts,
              ends: event.ends,
              type: index % 2 === 0 ? "Hybrid" : "Online", // mock
              name: event.name,
              imageUrl: event.image[0].url,
            }
          }
        )

        setEvents(mappedEvents)
      })
      .catch((e) => {
        console.log(e)
        setError(true)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return { events, isLoading }
}
