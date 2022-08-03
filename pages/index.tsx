import { Grid, Typography, Divider, IconButton } from "@mui/material"
import { ArrowForwardIos, ArrowBackIosNew } from "@mui/icons-material"
import { Scheduler } from "../components/Schedulers"
import { useSchedulers } from "../hooks"
import { useCallback, useMemo } from "react"

const Home = () => {
  const { schedulers, workOptions, setSchedulers, isLoading } = useSchedulers()

  const title = useMemo(() => {
    const startMonth = schedulers[0]?.month
    const endMonth = schedulers[6]?.month
    const startDate = schedulers[0]?.date
    const endDate = schedulers[6]?.date
    if (startMonth !== endMonth) {
      return `${startMonth} ${startDate} - ${endMonth} ${endDate}`
    }
    return `${startMonth} ${startDate} - ${endDate}`
  }, [schedulers])

  const setSavedScheduler = useCallback(
    (savedScheduler: Partial<Scheduler>) => {
      const newSchedulers = schedulers.map((scheduler) => {
        if (scheduler.rawDate === savedScheduler.rawDate) {
          return {
            ...scheduler,
            id: savedScheduler.id as number,
            savedWorkOption: savedScheduler.savedWorkOption,
          }
        }
        return scheduler
      })

      setSchedulers(newSchedulers)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schedulers]
  )

  const setCheckedInScheduler = useCallback(() => {
    setSchedulers(
      schedulers.map((scheduler, index) => {
        if (index === 0) {
          return { ...scheduler, checkedIn: true }
        }
        return scheduler
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedulers])

  return (
    <>
      {!isLoading && (
        <>
          <Grid container>
            <Grid item md={8}>
              <Typography component="h1" variant="h5">
                {title}
              </Typography>
            </Grid>
            <Grid item md={4} sx={{ display: "flex", justifyContent: "end" }}>
              <IconButton
                color="inherit"
                size="small"
                sx={{ borderRadius: 1, border: "solid 1px grey", mr: 1 }}
              >
                <ArrowBackIosNew fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={{ borderRadius: 1, border: "solid 1px grey" }}
              >
                <ArrowForwardIos fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
          <Divider sx={{ my: 1 }} />

          {schedulers.map((scheduler) => (
            <Scheduler
              scheduler={scheduler}
              workOptions={workOptions}
              key={scheduler.rawDate}
              setSavedScheduler={setSavedScheduler}
              setCheckedInScheduler={setCheckedInScheduler}
            />
          ))}
        </>
      )}
      {isLoading && <Typography variant="h5">Loading...</Typography>}
    </>
  )
}

export default Home
