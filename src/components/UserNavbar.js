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
import { backendApi, frontendApi } from "../urlConfig";
import Loading from "./Loading";
import emailjs from 'emailjs-com'

import TopAlert from "./TopAlert";

const UserNavbar = (props) => {
  const [showLogin, setShowLogin] = useState(0);
  const [showSignup, setShowSignup] = useState(0);
  const [show, setShow] = useState(0);
  const [alert, setAlert] = useState("");
  const [rating, setRating] = useState(0);
  const [showEmail, setshowEmail] = useState(0);
  const [emailLoader, setEmailLoader] = useState(0);
  const [passwordLoader, setPasswordLoader] = useState(0);
  const [showPassword, setshowPassword] = useState(0);
  const [fpModal, setfpModal] = useState(0);
  const [fpLoader, setfpLoader] = useState(0);
  const [topAlert,settopAlert]=useState(0);
  const [messg,setMessg]=useState('');
  const [color,setColor]=useState('');
 
  const handleSearch = (e) => {
    e.preventDefault();
    const ele = document.getElementsByClassName("cbcat");
    if (e.target[0].value !== "") {
      let catArr = [];
      Array.from(ele).forEach((e) => {
        if (e.checked) catArr.push(e.value);
      });

      props.changeLoad(1);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (res) => {
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
                  lat: res.coords.latitude,
                  long: res.coords.longitude,
                }),
              });
              const data = await rsp.json();
              if (data.ok) {
                props.changeLoad(0);
                setRating(1);
                props.search(data.ans);
              }
            };
            postSearch();
          },
          (err) => {
            alert("location not supported by your browser");
          }
        );
      }
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
    document.getElementById("inf").value = "";
    props.changeCat(Array.from(arr));
  };

  const sortRating = () => {
    let ele = document.getElementsByClassName("sortBtn");
    let item = document.getElementById("inf").value;

    Array.from(ele).forEach((e) => {
      if (e.innerText.localeCompare("Sort By Rating") === 0) {
        if (e.classList.contains("sortBtn1")) {
          // e.classList.remove('sortBtn1');
          // props.sortRating(0,[],"");
          // setRating(0);
        } else {
          e.classList.add("sortBtn1");
          const arr = document.getElementsByClassName("cbcat");
          let catarr = [];
          Array.from(arr).forEach((e) => {
            if (e.checked) {
              catarr.push(e.value);
            }
          });
          props.sortRating(1, catarr, item);
        }
      } else {
        e.classList.remove("sortBtn2");
      }
    });
  };
  const sortPrice = () => {
    let ele = document.getElementsByClassName("sortBtn");
    let item = document.getElementById("inf").value;
    Array.from(ele).forEach((e) => {
      if (e.innerText.localeCompare("Sort By Price") === 0) {
        if (e.classList.contains("sortBtn2")) {
          // e.classList.remove('sortBtn2');
        } else {
          e.classList.add("sortBtn2");
          const arr = document.getElementsByClassName("cbcat");
          let catarr = [];
          Array.from(arr).forEach((e) => {
            if (e.checked) {
              catarr.push(e.value);
            }
          });
          props.sortPrice(1, catarr, item);
        }
      } else {
        e.classList.remove("sortBtn1");
      }
    });
  };
  const changeEmail = (e) => {
    e.preventDefault();
    const post = async () => {
      const nemail = e.target[0].value;
      if (!nemail) {
        window.alert("Please enter a email");
      } else {
        setEmailLoader(1);
        const rsp = await fetch(`${backendApi}/user/changeemail`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${props.token}`,
          },
          body: JSON.stringify({ email: nemail }),
        });
        const data = await rsp.json();
        setEmailLoader(0);
        if (data.ok) {
          props.changeEmail(data.rsp.email);
          setshowEmail(!showEmail);
        } else {
          setShow(1);
          setAlert(data.err);
          setTimeout(() => {
            setShow(0);
            setAlert("");
          }, 2000);
        }
      }
    };
    post();
  };
  const changePassword = (e) => {
    e.preventDefault();
    const post = async () => {
      const cpassword = e.target[0].value;
      const npassword = e.target[1].value;
      if (cpassword.length < 6 || npassword.length < 6) {
        window.alert("Password must be 6 characters long");
      } else {
        setPasswordLoader(1);
        const rsp = await fetch(`${backendApi}/user/changepassword`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${props.token}`,
          },
          body: JSON.stringify({ cpassword, npassword }),
        });
        const data = await rsp.json();
        setPasswordLoader(0);
        if (data.ok) {
          setshowPassword(!showPassword);
        } else {
          setShow(1);
          setAlert(data.err);
          setTimeout(() => {
            setShow(0);
            setAlert("");
          }, 2000);
        }
      }
    };
    post();
  };
  const forgotPassword = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const post = async () => {
      setfpLoader(1);
      const rsp = await fetch(`${backendApi}/user/resetpassword`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await rsp.json();
      if (data.ok) {
        const ele=document.querySelector('#dummy-form');
        // console.log(ele);
        ele.elements[0].value=email;
        ele.elements[1].value=`${frontendApi}/user/reset/${data.token}`
        emailjs.sendForm('service_ua8e7uf', 'template_pzm2ufj', ele, 'V7fyITri4DopxVWzG')
          .then((result) => {
            setfpLoader(0);
            setfpModal(!setfpModal);
            setMessg('Link sent to your email');
            setColor('Green');
            settopAlert(1);
            setTimeout(()=>{
              settopAlert(0);
            },3000);
          }, (error) => {
              console.log(error.text);
          });
      }
      else{
        setfpLoader(0);
        setMessg(data.err);
        setColor('Red');
        settopAlert(1);
        setTimeout(()=>{
          settopAlert(0);
        },3000);
      }
    };
    post();
  };
  
  return (
    <>
    <form style={{display:'none'}} id='dummy-form'>
      <input type='email' name='email'/>
      <input type='text' name='link'/>
    </form>
      {
        topAlert?(
          <TopAlert text={messg} color={color} />
        ):(<></>)
      }
      <Modal
        show={showPassword}
        onHide={() => setshowPassword(!showPassword)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderAlert()}
          <Form onSubmit={changePassword}>
            <Form.Group className="mb-3" controlId="formBasicchangePassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your current password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicchangePassword2">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
              />
            </Form.Group>
            {passwordLoader ? (
              <Button
                variant="success"
                type="button"
                disabled={true}
                style={{ width: "123.5px", height: "38px" }}
              >
                <Loading size="lg" />
              </Button>
            ) : (
              <Button variant="success" type="submit">
                Save Changes
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={fpModal}
        onHide={() => setfpModal(!fpModal)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Forgot Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
          <Form onSubmit={forgotPassword}>
            <Form.Group className="mb-3" controlId="formBasicchangePassword">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Your Email" required />
            </Form.Group>
            {fpLoader ? (
              <Button variant="success" disabled={true} style={{ width: "93.7px", height: "38px" }}>
                <Loading size="lg" />
              </Button>
            ) : (
              <Button variant="success" type="submit">
                Send Link
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showEmail}
        onHide={() => setshowEmail(!showEmail)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change Email
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderAlert()}
          <Form onSubmit={changeEmail}>
            <Form.Group className="mb-3" controlId="formBasicchangeEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                defaultValue={props.email}
              />
            </Form.Group>
            {emailLoader ? (
              <Button
                variant="success"
                type="button"
                disabled={true}
                style={{ width: "123.5px", height: "38px" }}
              >
                <Loading size="lg" />
              </Button>
            ) : (
              <Button variant="success" type="submit">
                Save Changes
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
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
              <small
                style={{
                  color: "red",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setfpModal(!fpModal);
                  setShowLogin(!showLogin);
                }}
              >
                Forgot Password
              </small>
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
                      style={{ color: "green" }}
                    ></FontAwesomeIcon>
                    <strong>Home</strong>
                  </Link>

                  <button
                    className="dropdown-item btn"
                    style={{ borderRadius: " 0" }}
                    onClick={() => setshowEmail(!showEmail)}
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
                    onClick={() => setshowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      icon={faKey}
                      className="px-1"
                      style={{ color: "orange" }}
                    ></FontAwesomeIcon>
                    <strong>Change Password</strong>
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
                    onClick={() => {
                      props.resetHawker();
                      setRating(0);
                    }}
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

        {rating && props.h.length > 0 ? (
          <>
            <button className="mybtns mybtn1 mr-3 sortBtn" onClick={sortRating}>
              <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>Sort By Rating
            </button>
            <button className="mybtns mybtn2 mx-3 sortBtn" onClick={sortPrice}>
              <FontAwesomeIcon icon={faInr}></FontAwesomeIcon>Sort By Price
            </button>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export default UserNavbar;
