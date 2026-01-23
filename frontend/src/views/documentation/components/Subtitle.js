import React from 'react'
import {Typography} from "@mui/material";

const Subtitle = ({title}) => {

  return (
    <Typography variant={"h3"} align={"center"} sx={{color: '#1d90b5', marginBottom: 3 }}>{title}</Typography>
  )
}

export default Subtitle
