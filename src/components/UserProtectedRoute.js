import React from 'react'
import {Outlet,Navigate} from 'react-router-dom';

const UserProtectedRoute = ({isLog}) => {
  return (
    (isLog!=='')?<Outlet/>:<Navigate to='/user'/>
  )
}

export default UserProtectedRoute