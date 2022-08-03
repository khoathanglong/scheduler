import { Grid, Typography, CardMedia, Chip, IconButton } from "@mui/material"
import { ArrowForwardIos, ArrowBackIosNew } from "@mui/icons-material"
import { useMemo, useState } from "react"

export interface Event {
  id: number
  name: string
  type: "Hybrid" | "Online"
  starts: string
  ends: string
  imageUrl: string
}

interface EventProps {
  events: Event[]
}

export const Events = ({ events = [] }: EventProps) => {
  const [latestEventindex, setLatestEventIndex] = useState(0)

  const showSliderArrows = useMemo(() => {
    return events.length > 2
  }, [events])

  // display only 2 event at a time
  const displayingEvents = useMemo(() => {
    return events.slice(latestEventindex, latestEventindex + 2)
  }, [events, latestEventindex])

  return (
    <>
      <Grid container sx={{ my: 2, px: 2 }}>
        <Grid item md={6}>
          <Typography variant="subtitle1">Events</Typography>
        </Grid>
        {showSliderArrows && (
          <Grid item md={6} sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton
              sx={{ color: "text.secondary" }}
              size="small"
              onClick={() =>
                setLatestEventIndex(
                  latestEventindex > 0
                    ? latestEventindex - 2
                    : events.length - 1
                )
              }
            >
              <ArrowBackIosNew fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: "text.secondary" }}
              onClick={() =>
                setLatestEventIndex(
                  latestEventindex + 2 > events.length
                    ? 0
                    : latestEventindex + 2
                )
              }
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2} sx={{ px: 2, pb: 2 }}>
        {displayingEvents.map((event) => {
          const { id, name, starts, ends, imageUrl, type } = event
          return (
            <Grid item md={6} key={id}>
              <Grid container>
                <Grid item md={6}>
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={name}
                    height={100}
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
                <Grid item md={6} style={{ padding: 10 }}>
                  <Typography variant="body2" component="div">
                    <span>
                      {starts.slice(0, 6)} - {ends.slice(0, 6)}
                    </span>
                    <Chip
                      size="small"
                      sx={{ ml: 1, borderRadius: 1 }}
                      label={type}
                      variant="filled"
                      color={type === "Hybrid" ? "primary" : "secondary"}
                    />
                  </Typography>
                  <Typography variant="h6" component="div">
                    {name}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
