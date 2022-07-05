import Header from './components/Header';
import React, { useState } from 'react';
import {Routes,Route,BrowserRouter} from "react-router-dom";
import Hawker from './components/Hawker';
import User from './components/User';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import Inventory from './components/Inventory';
import About from './components/About';
import {Button,Form} from 'react-bootstrap'
import Loading from './components/Loading';
import { backendApi } from './urlConfig';

function App() {
  const [loader,setLoader]=useState(0);
  const handleReset=(e)=>{
    e.preventDefault();
    const password = e.target[0].value;
    if (password.length < 6) alert("Password must me 6 characters long");
    const token = window.location.pathname.split("/")[3];
    setLoader(1);
    const post = async () => {
      const rsp = await fetch(`${backendApi}/hawker/forgotpassword`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });
      const data = await rsp.json();
      setLoader(0);
      if (data.ok) {
        alert('Your password has been updated successfuly you can close this page and login again');
        // console.log(data.data);
      }else{
        setLoader(1);
        alert(data.err)
      }
    };
    post();
  }
  const renderReset=()=>{
    return (
      <div
        className="container"
        style={{ width: "max-content", margin: "2rem auto" }}
      >
        <Form onSubmit={handleReset}>
          <Form.Group className="mb-3" controlId="formBasic4">
            <Form.Label>New Password(Must me 6 characters long)</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your new password"
              required
            />
          </Form.Group>
          {loader ? (
            <Button variant="primary" disabled={true} style={{width:'64.05px',height:'38px'}}>
              <Loading size="lg" />
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Reset
            </Button>
          )}
        </Form>
      </div>
    )
  }
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
        <Route exact path="/hawker/reset/:token" element={renderReset()} />
        <Route exact path="/hawker/inventory" element={<Inventory/>} />
        <Route exact path="/hawker/about" element={<About/>} />
      </Routes>
    </BrowserRouter>
    </>
    
  );
}

export default App;
