import React from "react";
import { Button, Form, Alert,Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import Hawker from "./Hawker";
import { backendApi, frontendApi } from "../urlConfig";
import Loading from './Loading'
import TopAlert from "./TopAlert";
import emailjs from 'emailjs-com'

const Login = (props) => {
  const [messg, setMessg] = useState("");
  const [color, setColor] = useState("");
  const [show, setShow] = useState(0);
  const [fpModal, setfpModal] = useState(0);
  const [fpLoader, setfpLoader] = useState(0);
  const [alert, setAlert] = useState(0);
  const [alertMessg, setAlertMessg] = useState('');
  const [alertColor, setAlertColor] = useState('');
  
  const forgotPassword=(e)=>{
    e.preventDefault();
    const email=e.target[0].value;
    const post=async ()=>{
        setfpLoader(1);
        const rsp = await fetch(`${backendApi}/hawker/resetpassword`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
          const data = await rsp.json();
          if(data.ok){
            const ele=document.querySelector('#dummy-form');
            ele.elements[0].value=email;
            ele.elements[1].value=`${frontendApi}/hawker/reset/${data.token}`
            emailjs.sendForm('service_ua8e7uf', 'template_pzm2ufj', ele, 'V7fyITri4DopxVWzG')
            .then((result) => {
                setfpLoader(0);
                setfpModal(!setfpModal);
                setAlertMessg('Link sent to your email');
                setAlertColor('Green');
                setAlert(1);
                setTimeout(()=>{
                    setAlert(0);
                },2000);
            }, (error) => {
                console.log(error.text);
            });
          }
          else{
            setfpLoader(0);
            setAlertColor('red');
            setAlertMessg(data.err)
            setAlert(1);
            setTimeout(()=>{
                setAlert(0);
            },2000);
          }

    }
    post();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const hawker = {
      email: e.target[0].value,
      password: e.target[1].value,
    };
    fetch(`${backendApi}/hawker/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hawker),
    })
      .then((rsp) => rsp.json())
      .then((data) => {
        if (data.error) {
          setShow(1);
          setMessg(data.error);
          setColor("danger");
        } else {
          setShow(1);
          setMessg("Sucess Login");
          setColor("success");
          localStorage.setItem("user", data.token);
          localStorage.setItem("name", data.user.name.split(" ")[0]);
          window.location.href = `${frontendApi}/hawker`;
          window.location.reload();
        }
      });
  };
  const renderAlert = () => {
    if (show) {
      return (
        <Alert variant={color} onClose={() => setShow(false)} dismissible>
          {messg}
        </Alert>
      );
    } else return <div></div>;
  };
  if (localStorage.getItem("user")) {
    return <Hawker />;
  } else {
    return (
      <>
      <form style={{display:'none'}} id='dummy-form'>
        <input type='email' name='email'/>
        <input type='text' name='link'/>
       </form>
      {
        alert?(<TopAlert text={alertMessg} color={alertColor}/>):(<></>)
      }
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
                <Button
                  variant="success"
                  disabled={true}
                  style={{ width: "93.7px", height: "38px" }}
                >
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
        <div className="login">
          {renderAlert()}
          <h2 className="my-3" style={{ color: "blue" }}>
            Login
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
              <Form.Text
                style={{
                  color: "red",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setfpModal(!fpModal)}
              >
                Forgot Password
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" className="mx-2">
              Login
            </Button>

            <Link to="/signup" className="mx-3">
              Create an account/Sign up
            </Link>
          </Form>
        </div>
      </>
    );
  }
};

export default Login;
