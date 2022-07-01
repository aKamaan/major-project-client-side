import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInr,
  faSearch,
  faStar,
  faTimes,
  faSignOut,
  faHeart,
  faHome,
  faEnvelope,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { backendApi } from "../urlConfig";

const UserNavbar = (props) => {
  const [showLogin, setShowLogin] = useState(0);
  const [showSignup, setShowSignup] = useState(0);
  const [show, setShow] = useState(0);
  const [alert, setAlert] = useState("");
  const [rating,setRating]=useState(0);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const ele = document.getElementsByClassName("cbcat");
    if (e.target[0].value !== "") {
      let catArr = [];
      Array.from(ele).forEach((e) => {
        if (e.checked) catArr.push(e.value);
      });
      
      props.changeLoad(1);
      if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(
          res=>{
              const postSearch = async () => {
                const rsp = await fetch(`${backendApi}/hawker/search`, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    item: e.target[0].value,
                    cat: catArr,
                    lat:res.coords.latitude,
                    long:res.coords.longitude
                  }),
                });
                const data = await rsp.json();
                if (data.ok) {
                  props.changeLoad(0);
                  setRating(1);
                  props.search(data.ans);
                }
              }
              postSearch();
            },
            err=>{
              alert("location not supported by your browser");
            }
          )
      };
    } else {
      window.alert("Please enter some value");
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();
    const login = async () => {
      const rsp = await fetch(`${backendApi}/user/signin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target[0].value,
          password: e.target[1].value,
        }),
      });
      const data = await rsp.json();
      if (data.ok) {
        setShowLogin(!showLogin);
        localStorage.setItem("username", data.user.name);
        localStorage.setItem("userToken", data.token);
        props.changeUser(data.token, data.user.name);
      } else {
        setShow(1);
        setAlert(data.error);
        setTimeout(() => {
          setShow(0);
        }, 2000);
      }
    };
    login();
  };
  const handleSignup = (e) => {
    e.preventDefault();
    const signup = async () => {
      const rsp = await fetch(`${backendApi}/user/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target[0].value,
          password: e.target[1].value,
          name: e.target[2].value,
          lat: "",
          long: "",
        }),
      });
      const data = await rsp.json();
      if (data.ok) {
        setShowSignup(!showSignup);
        setShow(0);
        setShowLogin(!showLogin);
      } else {
        setShow(1);
        setAlert(data.error);
        setTimeout(() => {
          setShow(0);
        }, 2000);
      }
      // console.log(data);
    };
    signup();
  };
  const renderAlert = () => {
    if (show) {
      // setShow(0);
      return (
        <>
          <Alert variant="danger" onClose={() => setShow(0)} dismissible>
            {alert}
          </Alert>
        </>
      );
    } else return <div></div>;
  };
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userToken");
    props.changeUser("", "");
  };

  const filtCat = () => {
    const arr = document.getElementsByClassName("cbcat");
    setRating(0);
    document.getElementById('inf').value='';
    props.changeCat(Array.from(arr));
  };
 
  const sortRating=()=>{
    let ele=document.getElementsByClassName('sortBtn');
    let item=document.getElementById('inf').value;

    Array.from(ele).forEach(e=>{
      if(e.innerText.localeCompare("Sort By Rating")===0){
        if(e.classList.contains('sortBtn1')){
          // e.classList.remove('sortBtn1');
          // props.sortRating(0,[],"");
          // setRating(0);
        }
        else{
          e.classList.add('sortBtn1');
          const arr = document.getElementsByClassName("cbcat");
          let catarr=[];
          Array.from(arr).forEach(e=>{
            if(e.checked){
              catarr.push(e.value);
            }
          })
          props.sortRating(1,catarr,item);
        }
      }
      else{
        e.classList.remove('sortBtn2');
      }
    })
  }
  const sortPrice=()=>{
    let ele=document.getElementsByClassName('sortBtn');
    let item=document.getElementById('inf').value;
    Array.from(ele).forEach(e=>{
      if(e.innerText.localeCompare("Sort By Price")===0){
        if(e.classList.contains('sortBtn2')){
          // e.classList.remove('sortBtn2');
        }
        else{
          e.classList.add('sortBtn2');
          const arr = document.getElementsByClassName("cbcat");
          let catarr=[];
          Array.from(arr).forEach(e=>{
            if(e.checked){
              catarr.push(e.value);
            }
          })
          props.sortPrice(1,catarr,item);
        }
      }
      else{
        e.classList.remove('sortBtn1');
      }
    })
  }
  return (
    <>
      <Modal
        show={showLogin}
        onHide={() => setShowLogin(!showLogin)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderAlert()}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasic1">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter you password" />
            </Form.Group>
            <Button variant="success" type="submit">
              Login
            </Button>
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                setShowSignup(!showSignup);
                setShowLogin(!showLogin);
              }}
            >
              Create Account...
            </button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showSignup}
        onHide={() => setShowSignup(!showSignup)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create a new account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderAlert()}
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3" controlId="formBasic3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter you password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic5">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter you name" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="container fluid mt-4">
        <div className="d-flex flex-row bd-highlight mb-3">
          <div className=" bd-highlight">
            {props.username === "" ? (
              <button
                className="btn btn-success"
                onClick={() => setShowLogin(!showLogin)}
                style={{ borderRadius: " 5px 0 0 5px" }}
              >
                Login
              </button>
            ) : (
              <div className="dropdown">
                <button
                data-offset="0,10"
                  className="btn btn-success dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={{ borderRadius: " 5px 0 0 5px" }}
                >
                  {props.username}
                </button>

                <div
                  className="dropdown-menu shadow bg-white rounded"
                  aria-labelledby="dropdownMenuButton"
                >
                  <Link
                    className="dropdown-item"
                    to="/user"
                    style={{
                      textDecoration: "none",
                      color: "black",
                      padding: "5px 17px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faHome}
                      className="px-1"
                      style={{ color: "green"}}
                    ></FontAwesomeIcon>
                    <strong>Home</strong>
                  </Link>

                  <button
                    className="dropdown-item btn"
                    style={{ borderRadius: " 0" }}
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="px-1"
                      style={{ color: "blue" }}
                    ></FontAwesomeIcon>
                    <strong>Change Email</strong>
                  </button>
                  <button
                    className="dropdown-item btn"
                    style={{ borderRadius: " 0" }}
                  >
                    <FontAwesomeIcon
                      icon={faKey}
                      className="px-1"
                      style={{ color: "orange" }}
                    ></FontAwesomeIcon>
                    <strong>Cahange Password</strong>
                  </button>
                  <Link
                    className="dropdown-item"
                    to="/user/userfav"
                    style={{
                      textDecoration: "none",
                      color: "black",
                      padding: "5px 17px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="px-1"
                      style={{ color: "red" }}
                    ></FontAwesomeIcon>
                    <strong>Favorites</strong>
                  </Link>

                  <hr style={{ margin: "0.3rem 0" }} />
                  <button
                    className="dropdown-item btn lgbtn"
                    onClick={handleLogout}
                    style={{ borderRadius: " 0" }}
                  >
                    <FontAwesomeIcon
                      icon={faSignOut}
                      className="px-1"
                    ></FontAwesomeIcon>
                    <strong>Logout</strong>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-grow-1 bd-highlight">
            <Form className="d-flex" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type item name you want to search..."
                  style={{ borderRadius: "0px", border: "1px solid white" }}
                  id="inf"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-light"
                    type="reset"
                    style={{ borderRadius: "0px" }}
                    id="clr-btn"
                    onClick={() => {props.resetHawker();setRating(0)}}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      id="clr-icon"
                    ></FontAwesomeIcon>
                  </button>
                </div>
                <button
                  type="submit"
                  className="btn btn-danger"
                  style={{ borderRadius: "0px" }}
                >
                  <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </button>
              </div>
            </Form>
          </div>
          <div className="bd-highlight">
          <div className="dropdown">
              <button
              data-offset="0,10"
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{ borderRadius: "0 5px 5px 0", width: "100%" }}
              >
                Choose Category
              </button>

              <div
                className="dropdown-menu shadow bg-white rounded"
                aria-labelledby="dropdownMenuButton"
                id="dm2"
                style={{ minWidth: "12rem" }}
              >
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <label htmlFor="fs" style={{ cursor: "pointer" }}>
                      <strong>Fruit Seller</strong>
                    </label>
                    <span className="badge">
                      <input
                        type="checkbox"
                        id="fs"
                        onChange={filtCat}
                        className="cbcat"
                        value="Fruit Seller"
                      ></input>
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <label htmlFor="vs" style={{ cursor: "pointer" }}>
                      <strong>Vegetable Seller</strong>
                    </label>
                    <span className="badge">
                      <input
                        type="checkbox"
                        id="vs"
                        onChange={filtCat}
                        className="cbcat"
                        value="Vegetable Seller"
                      ></input>
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <label htmlFor="sp" style={{ cursor: "pointer" }}>
                    
                      <strong>Service Provider</strong>
                    </label>
                    <span className="badge">
                      <input
                        type="checkbox"
                        id="sp"
                        onChange={filtCat}
                        className="cbcat"
                        value="Service Provider"
                      ></input>
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <label htmlFor="sf" style={{ cursor: "pointer" }}>
                      <strong>Street Food</strong>
                    </label>
                    <span className="badge">
                      <input
                        type="checkbox"
                        id="sf"
                        onChange={filtCat}
                        className="cbcat"
                        value="Street Food"
                      ></input>
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <label htmlFor="ics" style={{ cursor: "pointer" }}>
                      <strong>Ice Cream Seller</strong>
                    </label>
                    <span className="badge">
                      <input
                        type="checkbox"
                        id="ics"
                        onChange={filtCat}
                        className="cbcat"
                        value="Ice Cream Seller"
                      ></input>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
       
        {
          (rating && props.h.length>0)?(
            <>
              <button className="mybtns mybtn1 mr-3 sortBtn" onClick={sortRating}><FontAwesomeIcon icon={faStar}></FontAwesomeIcon>Sort By Rating</button>
              <button className="mybtns mybtn2 mx-3 sortBtn" onClick={sortPrice}><FontAwesomeIcon icon={faInr}></FontAwesomeIcon>Sort By Price</button>
            </>
          ):<div></div>
        }
        
      </div>
    </>
  );
};

export default UserNavbar;
