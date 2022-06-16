import Login from "./Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faInfoCircle,
  faPowerOff,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { useEffect } from "react";
import {backendApi, frontendApi} from '../urlConfig'

function Hawker() {
  const user = localStorage.getItem("user");
  const name = localStorage.getItem("name");
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    window.location.assign(`${frontendApi}/login`);
  };
  useEffect(() => {
    if (user) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (res) => {
            // console.log(res.coords.latitude,res.coords.longitude)
            const updateLocation = async () => {
              await fetch(
                `${backendApi}/hawker/updatelocation`,
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `bearer ${user}`,
                  },
                  body:JSON.stringify({lat:res.coords.latitude,long:res.coords.longitude})
                }
              );
            };
            updateLocation();
          },
          (err) => {
            
          }
        );
      } else {
        console.log("location not supprted");
      }
    }
  });
  if (user) {
    return (
      <>
        <div className="container fluid ">
          <div className="row m-3">
            <div
              className="col-md-12"
              style={{
                borderRadius: "10px",
                backgroundImage:
                  "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
              }}
            >
              <h1
                style={{
                  textTransform: "capitalize",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Welcome {name}
              </h1>
            </div>
          </div>
          <div className="row m-5 d-flex justify-content-around">
            <div className="col-md-3 col-sm-12">
              <div
                className="card text-white mb-3"
                style={{
                  maxWidth: "18rem",
                  background: "linear-gradient(to right, #00f260, #0575e6)",
                }}
              >
                <div className="card-header" style={{ textAlign: "center" }}>
                  <Link
                    to="/hawker/profile"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Profile
                  </Link>
                </div>
                <div className="card-body">
                  <Link
                    to="/hawker/profile"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="fa-5x"
                      style={{ display: "block", margin: "auto" }}
                    ></FontAwesomeIcon>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-12">
              <div
                className="card text-white mb-3"
                style={{
                  maxWidth: "18rem",
                  background: "linear-gradient(to right, #f12711, #f5af19)",
                }}
              >
                <div className="card-header" style={{ textAlign: "center" }}>
                  <Link
                    to="/hawker/inventory"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Inventory
                  </Link>
                </div>
                <div className="card-body">
                  <Link
                    to="/hawker/inventory"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <FontAwesomeIcon
                      icon={faTruck}
                      className="fa-5x"
                      style={{ display: "block", margin: "auto" }}
                    ></FontAwesomeIcon>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row m-5 d-flex justify-content-around">
            <div className="col-md-3 col-sm-12">
              <div
                className="card text-white mb-3"
                style={{
                  maxWidth: "18rem",
                  background:
                    "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
                }}
              >
                <div className="card-header" style={{ textAlign: "center" }}>
                  <Link
                    to="/hawker/about"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    About Us
                  </Link>
                </div>
                <div className="card-body">
                  <Link
                    to="/hawker/about"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="fa-5x"
                      style={{ display: "block", margin: "auto" }}
                    ></FontAwesomeIcon>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-12">
              <div
                className="card text-white mb-3"
                style={{
                  maxWidth: "18rem",
                  background: "linear-gradient(to right, #373b44, #4286f4)",
                }}
              >
                <div className="card-header" style={{ textAlign: "center" }}>
                  <Nav.Link
                    style={{
                      textDecoration: "none",
                      color: "white",
                      padding: "0px",
                    }}
                    onClick={handleLogout}
                  >
                    Log Out
                  </Nav.Link>
                </div>
                <div className="card-body">
                  <Nav.Link
                    style={{
                      textDecoration: "none",
                      color: "white",
                      padding: "0px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPowerOff}
                      className="fa-5x"
                      style={{ display: "block", margin: "auto" }}
                      onClick={handleLogout}
                    ></FontAwesomeIcon>
                  </Nav.Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Login />;
  }
}

export default Hawker;
