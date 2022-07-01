import Header from './components/Header';
import React from 'react';
import {Routes,Route,BrowserRouter} from "react-router-dom";
import Hawker from './components/Hawker';
import User from './components/User';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import Inventory from './components/Inventory';
import About from './components/About';

function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Header/>} />
        <Route exact path="/user/*" element={<User/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/signup" element={<SignUp/>} />
        <Route exact path="/hawker" element={<Hawker/>} />
        <Route exact path="/hawker/profile" element={<Profile/>} />
        <Route exact path="/hawker/inventory" element={<Inventory/>} />
        <Route exact path="/hawker/about" element={<About/>} />
      </Routes>
    </BrowserRouter>
    </>
    
  );
}

export default App;
