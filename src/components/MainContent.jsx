import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/material';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment'
import "moment/dist/locale/ar-ma"
moment.locale("ar")
import axios from "axios"
import { useEffect, useState } from 'react';

export default function MainContent() {
    //States
    const [selectedCity,setSelectedCity] = useState(
        {displayName:'الرباط',
        api:"Rabat"})

    const [today,setToday] = useState("")

    const [nextIndex,setNextIndex] = useState(0)

    const [remainingTime,setRemainingTime] = useState('')

    const cityValues = [
        {displayName:'الرباط',
                api:"Rabat"},
        {displayName:'الدار البيضاء ',
                api:"Casablanca"},
        {displayName:'فاس',
                api:"Fès"}]
    const [timing,setTiming] = useState({
        Fajr: "06:41",
        Dhuhr: "13:17",
        Asr: "16:00",
        Maghrib: "18:18",
        Isha: "19:48",
})

const prayerArray = [{
    key:"Fajr",displayName:'الصبح'},
    {key:"Dhuhr",displayName:'الظهر'},
    {key:"Asr",displayName:'العصر'},
    {key:"Maghrib",displayName:'المغرب'},
    {key:"Isha",displayName:'العشاء'},
]

    const getTimings = async () =>{
            const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${selectedCity.api}&country=MA&method=8`);
            setTiming(response.data.data.timings)
            console.log(response)    
    }

    const callDownSetUpTimer = () =>{
        const momentNow = moment()

        let prayerIndex = null

        if (
            momentNow.isAfter(moment(timing["Fajr"],"hh:mm")) &&
            momentNow.isBefore(moment(timing["Dhuhr"],"hh:mm"))
        ) {
             prayerIndex = 1
        } else if (
            momentNow.isAfter(moment(timing["Dhuhr"],"hh:mm")) &&
            momentNow.isBefore(moment(timing["Asr"],"hh:mm"))
        ) {
             prayerIndex = 2
        } else if (
            momentNow.isAfter(moment(timing["Asr"],"hh:mm")) &&
            momentNow.isBefore(moment(timing["Maghrib"],"hh:mm"))
        ) {
             prayerIndex = 3
        }else if (
            momentNow.isAfter(moment(timing["Maghrib"],"hh:mm")) &&
            momentNow.isBefore(moment(timing["Isha"],"hh:mm"))
        ) {
             prayerIndex = 4
        }else{
             prayerIndex = 0
        }
        
       setNextIndex(prayerIndex)
        const Isha = timing["Isha"]
        const IshaMoment = moment(Isha,"hh:mm")
       
        const nextPrayerObject = prayerArray[prayerIndex]
        const nextPrayerTime = timing[nextPrayerObject.key]
        const nextPrayerTimeMoment = moment(nextPrayerTime , 'hh:mm')
        let remainigTime = moment(nextPrayerTime,"hh:mm").diff(momentNow)

       const durationRemainingTime = moment.duration(remainigTime)

        if(nextIndex===0){
            const midnightDff = moment("23:59:59","hh:mm:ss").diff(momentNow)
            const fajrMidnightDff = nextPrayerTimeMoment.diff(moment("00:00:00" , 'hh:mm:ss'))
            const totaldiff = midnightDff + fajrMidnightDff
            remainigTime = totaldiff
            console.log("ttttt",totaldiff)
            setRemainingTime(`${durationRemainingTime.hours()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.seconds()}`)
            console.log(durationRemainingTime.hours(),durationRemainingTime.minutes(),durationRemainingTime.seconds())
            
        }
         
        setRemainingTime(`  ${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()}: ${durationRemainingTime.hours()} `)
        console.log(durationRemainingTime.hours(),durationRemainingTime.minutes(),durationRemainingTime.seconds())
        
    }


    const handleChange = (event) => {
        const cityObject = cityValues.find((city)=>{
            return ( city.api === event.target.value)
        })
        setSelectedCity(cityObject)
    };
 
    useEffect(()=>{
        getTimings()
        const t = moment()
        setToday(t.format("MMM Do YYYY | h:mm"))
        const interval = setInterval(()=>{setToday(t.format("MMM Do YYYY | h:mm"))},60000)
        return()=>{
            clearInterval(interval)
        }
    },[selectedCity])

    useEffect(()=>{
        const interval = setInterval(()=>{
            console.log("calling timer")
            callDownSetUpTimer()
        },1000)
        return()=>{clearInterval(interval)}
        
    },[timing])

    
   
  return (
  <>
  {/* Top row */}
    <Grid container spacing={2}>
        <Grid item xs={12} md={6}  >
            <div>
                <h2>{today}</h2>
                <h1>{selectedCity.displayName}</h1>
            </div>
        </Grid>

        <Grid item xs={12} md={6}>
            <div>
                <h2> متبقي حتى صلاة {prayerArray[nextIndex].displayName}</h2>
                <h1>{remainingTime}</h1>
            </div>
        </Grid>
    </Grid>
    {/* Toprow */}
    <Divider/>

    <Stack direction={"row"} justifyContent={"space-around"} style={{marginTop:"50px "}}>
        <Prayer name="الصبح" time={timing.Fajr} image={"https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/39/8e/32.jpg"}/>
        <Prayer name="الظهر" time={timing.Dhuhr} image={"https://atlanticagdal.com/wp-content/uploads/2017/11/tour-hassan-rabat-maroc1-1024x683.jpg"}/>
        <Prayer name="العصر" time={timing.Asr} image={"https://cdn.getyourguide.com/img/location/5cf66d50915c1.jpeg/49.webp"}/>
        <Prayer name="المغرب" time={timing.Maghrib} image={"https://www.mymarrakechtours.com/pictures-site/blogs-pic/blog-31/mosquee-koutoubia-marrakech-au-lever-du-soleil.jpg"}/>
        <Prayer name="العشاء" time={timing.Isha} image={"https://media-cdn.tripadvisor.com/media/photo-s/00/1b/07/c6/agadir-mosque.jpg"}/>
    </Stack>

    <Stack direction={"row"} justifyContent="center" style={{marginTop:"20px"}}>
    <FormControl style={{width:"20%"}}>
        <InputLabel id="demo-simple-select-label">City</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
        //   value={age}
        label="Age"
        onChange={handleChange} >
        
            {cityValues.map((e,i)=>{return (
            <MenuItem key={i} value={e.api}>
                {e.displayName}
            </MenuItem>)})}
        
        </Select>
    </FormControl>
    </Stack>
    </>
  )
}
