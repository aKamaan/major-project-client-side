import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
const Loading = ({size}) => {
  return (
    <div style={{position:'absolute',top:"50%",left:"50%",transform:'translate(-50%,-50%)'}}><FontAwesomeIcon icon={faCircleNotch} size={size} spin></FontAwesomeIcon></div>
  )
}

export default Loading