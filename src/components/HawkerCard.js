import React, { useState, useEffect } from "react";
import { backendApi } from "../urlConfig";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import HawkerInv from "./HawkerInv";
import HawkerRev from "./HawkerRev";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPhone } from "@fortawesome/free-solid-svg-icons";

const HawkerCard = (props) => {
  const remove = (str) => str.slice(0, -4);
  const [basicActive, setBasicActive] = useState("tab1");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState(0);
  const [rev, setRev] = useState([]);
  const [dis, setDis] = useState(1);

  useEffect(() => {
    if (props.username === "") {
      let favBtn = document.getElementsByClassName("mybtn");
      Array.from(favBtn).forEach((e) => {
        if (e.classList.contains("deletefav")) e.classList.remove("deletefav");
        e.style.opacity = 0.5;
        setDis(1);
      });
    } else {
      let favBtn = document.getElementsByClassName("mybtn");
      Array.from(favBtn).forEach((e) => {
        e.style.opacity = 1;
        setDis(0);
      });
      if(props.favid.includes(props.data._id.toString())){
        document.getElementById(props.data._id.toString()).classList.add('deletefav')
      }
    }
  }, [props.username,props.data._id,props.favid]);
  const toggleFav = (event) => {
    let favBtn = document.getElementById(event.currentTarget.id);
    if (favBtn.classList.contains("deletefav")) {
      favBtn.classList.remove("deletefav");
      props.delfav(event.currentTarget.id);
    } else {
      props.addfav(event.currentTarget.id);
    }
  };
  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }
    setBasicActive(value);
  };
  useEffect(() => {
    const getRev = async () => {
      const rsp = await fetch(`${backendApi}/hawker/review/${props.data._id}`, {
        method: "GET",
      });
      const data = await rsp.json();

      if (data !== null) {
        setRev(data.reviews);
        // console.log(data)
      }
      else{
        setRev([])
      }
    };
    getRev();
  }, [props.data._id]);
  useEffect(() => {
    if (rev.length > 0) {
      let sum = 0;
      setReview(rev.length);
      rev.forEach((e) => (sum += e.rating));
      setRating((sum / rev.length).toFixed(1));
      props.setRating(props.data._id,(sum / rev.length).toFixed(1))
    }
    else{
      setReview(0);
      setRating(0);
    }
  }, [rev,props]);
  return (
    <>
      <div className="col-sm-12 col-md-4">
        <div className="image-flip">
          <div className="mainflip flip-0">
            <div className="frontside " style={{ width: "100%" }}>
              <div className="card">
                <div className="card-body text-center">
                  <img
                    src={`${remove(backendApi)}/${props.data.profileimage}`}
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: "150px", height: "150px" }}
                  />
                  <h5 className="my-3" style={{ textTransform: "capitalize" }}>
                    {props.data.name}
                  </h5>
                  <p
                    className="text-muted mb-1"
                    style={{ textTransform: "capitalize" }}
                  >
                    {props.data.category}
                  </p>
                  <p
                    className="text-muted mb-4"
                    style={{ textTransform: "capitalize" }}
                  >
                    {props.data.locality}, {props.data.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="backside" style={{ width: "100%" }}>
              <div className="card h-100">
                <div className="card-body">
                  <MDBTabs fill>
                    <MDBTabsItem>
                      <MDBTabsLink
                        onClick={() => handleBasicClick("tab1")}
                        active={basicActive === "tab1"}
                      >
                        Info
                      </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem>
                      <MDBTabsLink
                        onClick={() => handleBasicClick("tab2")}
                        active={basicActive === "tab2"}
                      >
                        Reviews
                      </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem>
                      <MDBTabsLink
                        onClick={() => handleBasicClick("tab3")}
                        active={basicActive === "tab3"}
                      >
                        Inventory
                      </MDBTabsLink>
                    </MDBTabsItem>
                  </MDBTabs>

                  <MDBTabsContent>
                    <MDBTabsPane show={basicActive === "tab1"}>
                      <div className="container px-1 mt-1">
                        <div className="row">
                          <div className="col-md-3 col-3">
                            <p className="mb-0">Rating</p>
                          </div>
                          <div className="col-md-4 col-4">
                            {review === 0 ? (
                              <p className="text-muted mb-0">No reviews</p>
                            ) : (
                              <p className="text-muted mb-0">{rating}/5 star</p>
                            )}
                          </div>
                          <div className="col-md-3 col-3">
                            <p className="mb-0">Reviews</p>
                          </div>
                          <div className="col-md-2 col-2">
                            <p className="text-muted mb-0">{review}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3 col-3">
                            <p className="mb-0">Email</p>
                          </div>
                          <div className="col-sm-9 col-9">
                            <p className="text-muted mb-0">
                              {props.data.email}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3 col-3">
                            <p className="mb-0">Phone</p>
                          </div>
                          <div className="col-sm-9 col-9">
                            <p className="text-muted mb-0">
                              {props.data.contact}
                            </p>
                          </div>
                        </div>
                        <hr />

                        <div className="row">
                          <div className="col-sm-3 col-3">
                            <p className="mb-0">Address</p>
                          </div>
                          <div className="col-sm-9 col-9">
                            <p
                              className="text-muted mb-0"
                              style={{ textTransform: "capitalize" }}
                            >
                              {props.data.locality}, {props.data.city}
                            </p>
                          </div>
                        </div>
                        <div className="row my-1 d-flex flex-row-reverse">
                          <div className="col-md-2 col-2">
                            <a
                              className="btn btn-primary btn-xlg"
                              href={`tel:${props.data.contact}`}
                              style={{ backgroundColor: "rgba(0,0,238,1)" }}
                            >
                              <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                            </a>
                          </div>
                          <div className="col-md-2 col-2">
                            {
                              props.favid.includes(props.data._id.toString())?(

                                <button
                                  className="mybtn deletefav"
                                  id={props.data._id.toString()}
                                  onClick={toggleFav}
                                  disabled={dis}
                                >
                                  <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                                </button>
                              ):(<button
                                className="mybtn"
                                id={props.data._id.toString()}
                                onClick={toggleFav}
                                disabled={dis}
                              >
                                <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                              </button>)
                            }
                          </div>
                        </div>
                      </div>
                    </MDBTabsPane>
                    <MDBTabsPane show={basicActive === "tab2"}>
                      <HawkerRev
                        id1={props.data._id}
                        username={props.username}
                        token={props.token}
                        rev={rev}
                        updateRev={(r) => setRev(r)}
                      />
                    </MDBTabsPane>
                    <MDBTabsPane show={basicActive === "tab3"}>
                      <HawkerInv data={props.data} />
                    </MDBTabsPane>
                  </MDBTabsContent>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HawkerCard;
