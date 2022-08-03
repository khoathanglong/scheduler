import { Grid, Typography, Card, Button, Chip } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { VpnKey, Check } from "@mui/icons-material"
import { Events } from "./Events"
import { WorkOption } from "../services"
import { useMemo, useState, useEffect } from "react"
import { useCheckin, useEvents, useSaveWorkOption } from "../hooks"

export interface Scheduler {
  id: number
  savedWorkOption?: WorkOption
  checkedIn: boolean
  rawDate: string
  date: string
  dayName: string
  month: string
}
interface SchedulerProps {
  scheduler: Scheduler
  workOptions: WorkOption[]
  setSavedScheduler: (savedScheduler: Partial<Scheduler>) => void
  setCheckedInScheduler: () => void
}

export const Scheduler = ({
  scheduler,
  workOptions,
  setSavedScheduler,
  setCheckedInScheduler,
}: SchedulerProps) => {
  const [selectWorkOption, setSelectWorkOption] = useState<WorkOption>({
    id: 1,
    name: "Office",
  })

  const { savedWorkOption, checkedIn, date, month, rawDate, dayName, id } =
    scheduler

  const { events } = useEvents(rawDate)

  const {
    isLoading: isSavingScheduler,
    scheduler: savedScheduler,
    handleSaveWorkOption,
  } = useSaveWorkOption()

  const {
    isLoading: isCheckingIn,
    scheduler: checkedInScheduler,
    handleCheckIn,
  } = useCheckin()

  useEffect(() => {
    if (savedScheduler.id) {
      setSavedScheduler(savedScheduler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedScheduler])

  useEffect(() => {
    if (checkedInScheduler.id) {
      setCheckedInScheduler()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedInScheduler])

  const isToday = useMemo(() => {
    return new Date().toDateString() === new Date(rawDate).toDateString()
  }, [rawDate])

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 2,
        my: 4,
        border: isToday ? "#CCCDFF 1px solid" : "#D1D5DB 1px solid",
      }}
      elevation={0}
    >
      <Grid
        container
        sx={{
          px: 2,
          backgroundColor: isToday ? "#F5F3FF" : "#F3F4F6",
          height: "72px",
          alignItems: "center",
        }}
      >
        <Grid item md={2}>
          <Typography
            variant="subtitle2"
            component="div"
            color={isToday ? "secondary" : "text"}
          >
            {month}
          </Typography>
          <Typography
            variant="h5"
            component="div"
            color={isToday ? "secondary" : "text"}
          >
            {date}
          </Typography>
        </Grid>
        <Grid item md={6}>
          <Typography variant="h6" component="div">
            {savedWorkOption?.name || (isToday ? "Today" : dayName)}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            {(savedWorkOption?.name && (isToday ? "Today" : dayName)) ||
              "Where are you working from?"}
          </Typography>
        </Grid>
        <Grid
          item
          md={4}
          sx={{ display: "flex", justifyContent: "end", py: 1 }}
        >
          {!checkedIn && isToday && savedWorkOption?.name && (
            <LoadingButton
              color="secondary"
              variant="outlined"
              size="small"
              loading={isCheckingIn}
              onClick={() => handleCheckIn(id as number)}
            >
              <Chip
                sx={{ borderRadius: 1, width: 32, height: 32, pl: 1 }}
                color="secondary"
                icon={
                  <VpnKey
                    fontSize="small"
                    color="secondary"
                    sx={{
                      transform: "rotate(135deg)",
                    }}
                  />
                }
              />
              <Typography sx={{ pl: 1 }} variant="button">
                Check in
              </Typography>
            </LoadingButton>
          )}

          {checkedIn && isToday && (
            <Button color="success" size="small" variant="outlined">
              <Typography sx={{ px: 1 }} variant="button">
                Checked in
              </Typography>
              <Chip
                sx={{ borderRadius: 1, width: 32, height: 32, pl: 1 }}
                size="small"
                color="success"
                icon={<Check fontSize="small" />}
              />
            </Button>
          )}

          {!checkedIn && !savedWorkOption?.name && (
            <>
              <LoadingButton
                color="secondary"
                variant="contained"
                size="small"
                loading={isSavingScheduler}
                sx={{ mr: 2 }}
                disableElevation
                onClick={() => handleSaveWorkOption(rawDate, selectWorkOption)}
              >
                Save
              </LoadingButton>
              <Button variant="outlined" size="small" color="inherit">
                Cancel
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      {!savedWorkOption?.name && (
        <Grid container spacing={2} sx={{ my: 2, px: 2 }}>
          {workOptions.map((workOption) => {
            return (
              <Grid item md={4} key={workOption.id}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderColor:
                      selectWorkOption.id === workOption.id
                        ? "#4338CA"
                        : "#D1D5DB",
                    color:
                      selectWorkOption.id === workOption.id
                        ? "#4338CA"
                        : "#1F2937",
                  }}
                  onClick={() => setSelectWorkOption(workOption)}
                >
                  {workOption.name}
                </Button>
              </Grid>
            )
          })}
        </Grid>
      )}

      {events.length > 0 && <Events events={events} />}
    </Card>
  )
}
