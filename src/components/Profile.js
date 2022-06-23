import React, { useEffect, useState } from "react";
import NavbarHawker from "./NavbarHawker";
import Login from "../components/Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { Modal, Form, Button } from "react-bootstrap";
import { backendApi } from "../urlConfig";

const Profile = () => {
  const user = localStorage.getItem("user");
  const [hid,setHid]=useState('');
  const [profileInfo, setProfileInfo] = useState({});
  const [showEmailModal, setshowEmailModal] = useState(0);
  const [showContactModal, setshowContactModal] = useState(0);
  const [showAddressModal, setshowAddressModal] = useState(0);
  const [showProfileImageModal, setshowProfileImageModal] = useState(0);
  const [op, setOp] = useState(0);
  const [rev, setRev] = useState([]);
  useEffect(() => {
    if (user) {
      const getInfo = async () => {
        const rsp = await fetch(`${backendApi}/hawker/profile`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${user}`,
          },
        });
        const data = await rsp.json();
        setProfileInfo(data);
        setHid(data._id)
        // console.log(profileInfo)
      };
      getInfo();
    }
  }, []);

  const menu = {
    position: "absolute",
    width: "50%",
    backgroundColor: "rgb(209, 175, 175)",
    borderRadius: "10px",
    zIndex: "10",
    right: "13%",
    top: "15%",
    opacity: `${op}`,
    transition: "0.1s",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  };
  const showMenu = () => {
    if (op === 1) setOp(0);
    else setOp(1);
  };

  const handleEmailModal = () => setshowEmailModal(!showEmailModal);
  const handleContactModal = () => setshowContactModal(!showContactModal);
  const handleAddressModal = () => setshowAddressModal(!showAddressModal);
  const handleProfileImageModal = () =>
    setshowProfileImageModal(!showProfileImageModal);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (e.target[0].value === "") alert("Please enter a email");
    else {
      const rsp = await fetch(`${backendApi}/hawker/updateemail`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${user}`,
        },
        body: JSON.stringify({ email: e.target[0].value }),
      });
      const data = await rsp.json();
      // console.log(data);
      if (data.ok) {
        setProfileInfo((prevState) => ({
          ...prevState,
          email: data.data.email,
        }));
      } else alert(data.message);
    }
  };
  const checkChar = (str) => {
    for (let i = 0; i < str.length; i++)
      if ((str[i] >= "a" && str[i] <= "z") || (str[i] >= "A" && str[i] <= "B"))
        return true;
    return false;
  };
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const str = e.target[0].value;
    // console.log(str.length);
    if (str === "" || str.length !== 10 || checkChar(str))
      alert("Please enter a valid contact");
    else {
      const rsp = await fetch(`${backendApi}/hawker/updatecontact`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${user}`,
        },
        body: JSON.stringify({ contact: str }),
      });
      const data = await rsp.json();
      // console.log(data);
      if (data.ok) {
        setProfileInfo((prevState) => ({
          ...prevState,
          contact: data.data.contact,
        }));
      } else alert(data.message);
    }
  };
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (e.target[0].value === "" || e.target[1].value === "")
      alert("Please enter a address");
    else {
      const rsp = await fetch(`${backendApi}/hawker/updateaddr`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${user}`,
        },
        body: JSON.stringify({
          locality: e.target[0].value,
          city: e.target[1].value,
        }),
      });
      const data = await rsp.json();
      // console.log(data);
      if (data.ok) {
        setProfileInfo((prevState) => ({
          ...prevState,
          locality: data.data.locality,
          city: data.data.city,
        }));
      } else alert(data.message);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // console.log(e.target[0].files[0]);
    if (e.target[0].value === "") alert("Please upload a file first");
    else {
      formData.append("updateProfile", e.target[0].files[0]);
      const rsp = await fetch(`${backendApi}/hawker/updateimage`, {
        method: "POST",
        headers: {
          Authorization: `bearer ${user}`,
        },
        body: formData,
      });
      const data = await rsp.json();
      // console.log(data);
      if (data.ok) {
        setProfileInfo((prevState) => ({
          ...prevState,
          profileimage: data.data.profileimage,
        }));
      }
    }
  };
  useEffect(() => {
    const getRev = async () => {
      const rsp = await fetch(`${backendApi}/hawker/review/${hid}`, {
        method: "GET",
      });
      const data = await rsp.json();
      // console.log(data);

      if (data !== null) {
        setRev(data.reviews);
      }
    };
    getRev();
  }, [hid]);
  const remove = (str) => {
    return str.slice(0, -4);
  };
  if (user) {
    return (
      <>
        <NavbarHawker />
        <Modal
          show={showProfileImageModal}
          onHide={() => setshowProfileImageModal(!showProfileImageModal)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change your Profile Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleProfileSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>New Profile Photo</Form.Label>
                <Form.Control
                  type="file"
                  placeholder=""
                  name="updateProfile"
                  accept="image/png, image/gif, image/jpeg"
                />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={() => setshowProfileImageModal(!showProfileImageModal)}
                className="mx-3"
              >
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={() => setshowProfileImageModal(!showProfileImageModal)}
              >
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal
          show={showEmailModal}
          onHide={() => setshowEmailModal(!showEmailModal)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change your Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEmailSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>New Email</Form.Label>
                <Form.Control type="email" placeholder="" />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={() => setshowEmailModal(!showEmailModal)}
                className="mx-3"
              >
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={() => setshowEmailModal(!showEmailModal)}
              >
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal
          show={showContactModal}
          onHide={() => setshowContactModal(!showContactModal)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change your Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleContactSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>New Contact</Form.Label>
                <Form.Control type="tel." placeholder="" />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={() => setshowContactModal(!showContactModal)}
                className="mx-3"
              >
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={() => setshowContactModal(!showContactModal)}
              >
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal
          show={showAddressModal}
          onHide={() => setshowAddressModal(!showAddressModal)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change your Address</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddressSubmit}>
              <Form.Group className="mb-3" controlId="formBasic1">
                <Form.Label>New Locality</Form.Label>
                <Form.Control type="text" placeholder="" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasic2">
                <Form.Label>New City</Form.Label>
                <Form.Control type="text" placeholder="" />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={() => setshowAddressModal(!showAddressModal)}
                className="mx-3"
              >
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={() => setshowAddressModal(!showAddressModal)}
              >
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <div className="container fluid">
          <div className="row m-3">
            <div className="col-md-3 col-sm-12">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <img
                    src={`${remove(backendApi)}/${profileInfo.profileimage}`}
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: "150px", height: "150px" }}
                  />
                  <h5 className="my-3" style={{ textTransform: "capitalize" }}>
                    {profileInfo.name}
                  </h5>
                  <p
                    className="text-muted mb-1"
                    style={{ textTransform: "capitalize" }}
                  >
                    {profileInfo.category}
                  </p>
                  <p
                    className="text-muted mb-4"
                    style={{ textTransform: "capitalize" }}
                  >
                    {profileInfo.locality}, {profileInfo.city}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-sm-12">
              <div className="card mb-4">
                <div className="card-body">
                  <div style={menu} id="menu">
                    <ul className="list-group list-group-flush rounded-3">
                      <li
                        className="list-group-item list-menu"
                        onClick={handleEmailModal}
                      >
                        <p style={{ margin: "0 auto" }}>Change Email</p>
                      </li>
                      <li
                        className="list-group-item list-menu"
                        onClick={handleContactModal}
                      >
                        <p style={{ margin: "0 auto" }}>Change Contact</p>
                      </li>
                      <li
                        className="list-group-item list-menu"
                        onClick={handleAddressModal}
                      >
                        <p style={{ margin: "0 auto" }}>Change Address</p>
                      </li>
                      <li
                        className="list-group-item list-menu"
                        onClick={handleProfileImageModal}
                      >
                        <p style={{ margin: "0 auto" }}>Change Profile Pic</p>
                      </li>
                    </ul>
                  </div>
                  <div className="row d-flex flex-row-reverse">
                    <div className="col-1 mx-3">
                      <FontAwesomeIcon
                        icon={faCog}
                        onClick={showMenu}
                      ></FontAwesomeIcon>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Name</p>
                    </div>
                    <div className="col-sm-7">
                      <p
                        className="text-muted mb-0"
                        style={{ textTransform: "capitalize" }}
                      >
                        {profileInfo.name}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{profileInfo.email}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Phone</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{profileInfo.contact}</p>
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Address</p>
                    </div>
                    <div className="col-sm-9">
                      <p
                        className="text-muted mb-0"
                        style={{ textTransform: "capitalize" }}
                      >
                        {profileInfo.locality}, {profileInfo.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="card mb-4 mb-lg-0">
                <div className="card-body p-0">
                  <h4
                    className="card-title"
                    style={{ textAlign: "center", paddingTop: "0.3rem" }}
                  >
                    Reviews
                  </h4>
                  {/* <hr style={{margin:'0'}}/> */}
                  {rev.length === 0 ? (
                    <div className="list-group reviewH">
                      <h5>No reviews</h5>
                    </div>
                  ) : (
                    <div className="list-group reviewH">
                      {rev.map((e, i) => {
                        return (
                          <div
                            className="list-group-item list-group-item-action flex-column align-items-start"
                            key={e._id}
                          >
                            <div className="d-flex w-100 justify-content-between">
                              <h5
                                className="mb-1"
                                style={{ fontSize: "0.9rem" }}
                              >
                                Rating : {e.rating} star
                              </h5>
                            </div>
                            <p className="mb-1">{e.review}</p>
                            <small>
                              -<i>{e.name}</i>
                            </small>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else return <Login />;
};

export default Profile;
