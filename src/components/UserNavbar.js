import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import {Link} from 'react-router-dom'
import { backendApi } from "../urlConfig";

const UserNavbar = (props) => {
  const [showLogin, setShowLogin] = useState(0);
  const [showSignup, setShowSignup] = useState(0);
  const [show, setShow] = useState(0);
  const [alert, setAlert] = useState("");

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
          lat:'',
          long:''
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
      }
      // console.log(data);
    };
    signup();
  };
  const renderAlert = () => {
    if (show) {
      return (
        <Alert variant="danger" onClose={() => setShow(0)} dismissible>
          {alert}
        </Alert>
      );
    } else return <div></div>;
  };
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userToken");
    props.changeUser("", "");
  };
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
            <Button variant="primary" type="submit">
              Login
            </Button>
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
            <Form.Group className="mb-3" controlId="formBasic1">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter you password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter you name" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-5">
        {props.username === "" ? (
          <>
            <div className=" navbar-collapse d-flex justify-content-between">
              <form className="form-inline my-2 my-lg-0 d-flex">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  className="btn btn-outline-success my-2 my-sm-0 mx-2"
                  type="submit"
                >
                  Search
                </button>
              </form>
              <ul className="navbar-nav">
                <li className="nav-item mx-3">
                  <button
                    className="btn btn-outline-success"
                    onClick={() => setShowLogin(!showLogin)}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowSignup(!showSignup)}
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link className="navbar-brand" to="/user">
              {props.username}
            </Link>

            <div className="navbar-collapse d-flex justify-content-between">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/user/userfav">
                    Favorites
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/about">
                    About
                  </Link>
                </li>
              </ul>
              
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default UserNavbar;
