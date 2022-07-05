import React,{useEffect} from 'react'
import aos from 'aos'
import 'aos/dist/aos.css'

const TopAlert = ({text,color}) => {
    useEffect(()=>{
        aos.init({duration:500})
    },[])
    const style={
        width:'max-content',
        position:'absolute',
        right:"1rem",
        top:'1rem',
        zIndex:20,
        background:color,
        padding:'0.6rem 1.5rem',
        fontSize:'1rem',
        borderRadius:'0.5rem',
        color:'white'
    }
    
  return (
    <div style={style} data-aos='fade-left'>{text}</div>
  )
}

export default TopAlert