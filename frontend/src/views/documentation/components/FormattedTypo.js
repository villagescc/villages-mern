import React from 'react'
import {Typography} from "@mui/material";

const FormattedTypo = (props) => {
  let {paddingBottom, textAlign} = props;

  if (paddingBottom === undefined) {
    paddingBottom = 2
  }

  if (textAlign === undefined) {
    textAlign = 'center'
  }

  return (
    <Typography sx={{paddingBottom, textAlign}}>{props.children}</Typography>
  )
}

export default FormattedTypo;
