import React, { useState } from "react";
import { backendApi } from "../urlConfig";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import HawkerInv from "./HawkerInv";
import HawkerRev from './HawkerRev'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const HawkerCard = (props) => {
  const remove = (str) => str.slice(0, -4);
  const [basicActive, setBasicActive] = useState("tab1");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState(0);

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };
  const calcAvg=(sum,len)=>{
    if(len===0)
      setRating(0);
    else
      setRating((sum/len).toFixed(1));
    setReview(len);
  }
  return (
    <>
      <div className="col-sm-12 col-md-4" key={props.data._id.toString()}>
        <div className="image-flip">
          <div className="mainflip flip-0">
            <div
              className="frontside "
              style={{ width: "100%", height: "100%" }}
            >
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
                          <div className="col-sm-3">
                            <p className="mb-0">Rating</p>
                          </div>
                          <div className="col-sm-4">
                            {
                              rating===0?(<p className="text-muted mb-0">No reviews
                              </p>):<p className="text-muted mb-0">
                                {rating}/5 star
                            </p>
                            }
                            
                          </div>
                          <div className="col-sm-3">
                            <p className="mb-0">
                              Reviews
                            </p>
                          </div>
                          <div className="col-sm-2">
                            <p className="text-muted mb-0">
                              {review}
                            </p>
                          </div>
              
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Email</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {props.data.email}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Phone</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {props.data.contact}
                            </p>
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
                              {props.data.locality}, {props.data.city}
                            </p>
                          </div>
                        </div>
                        <div className="row my-1">
                          <div className="col-md-2">
                            <a
                              className="btn btn-primary btn-xlg"
                              href={`tel:${props.data.contact}`}
                              style={{backgroundColor:"rgba(0,0,238,.5)"}}
                            >
                             <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                            </a>
                          </div>
                        </div>
                      </div>
                    </MDBTabsPane>
                    <MDBTabsPane show={basicActive === "tab2"}>
                      <HawkerRev id={props.data._id} username={props.username} token={props.token} getRatRev={(sum,len)=>calcAvg(sum,len)}/>
                    </MDBTabsPane>
                    <MDBTabsPane show={basicActive === "tab3"}>
                      <HawkerInv id={props.data._id} />
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
