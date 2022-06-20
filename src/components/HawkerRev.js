import React, { useEffect, useState } from "react";
import { backendApi } from "../urlConfig";
import { Modal, Form, Button } from "react-bootstrap";

const HawkerRev = (props) => {
  const [rev, setRev] = useState([]);
  const [disable, setDisable] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(0);
  useEffect(() => {
    if (props.username === "") setDisable(1);
    else setDisable(0);
  }, [props.username]);
  useEffect(() => {
    const getRev = async () => {
      const rsp = await fetch(`${backendApi}/hawker/review/${props.id}`, {
        method: "GET",
      });
      const data = await rsp.json();
      if (data === null) setRev([]);
      else setRev(data.reviews);
      let sum=0;
      rev.forEach(e=>sum+=e.rating);
      // console.log(sum);
      props.getRatRev(sum,rev.length);
    };
    getRev();
  }, [props,rev]);
  const submitRev = (e) => {
    e.preventDefault();
    // console.log(parseInt(e.target[0].value), e.target[1].value);
    const post = async () => {
      const rsp = await fetch(`${backendApi}/hawker/postreview/${props.id}`, {
        method:'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${props.token}`,
        },
        body: JSON.stringify({
          rating: parseInt(e.target[0].value),
          review: e.target[1].value,
        })
      });
      const data=await rsp.json();
      setRev(data.reviews)
    };
    post();
  };
  return (
    <>
      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(!showReviewModal)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add a review..
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitRev}>
            <Form.Group className="mb-3" controlId="formBasic1">
              <Form.Label>Rating</Form.Label>
              <Form.Select aria-label="Default select example">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasic2">
              <Form.Label>Review</Form.Label>
              <Form.Control type="textbox" placeholder="Give your Review" />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={() => setShowReviewModal(!showReviewModal)}>
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {rev.length === 0 ? (
        <div className="list-group review">
          <h5>No reviews</h5>
          <button
            className="btn btn-outline-primary mt-3"
            disabled={disable}
            onClick={() => setShowReviewModal(!showReviewModal)}
          >
            Add Review
          </button>
        </div>
      ) : (
        <div className="list-group review">
          {rev.map((e, i) => {
            return (
              <div
                className="list-group-item list-group-item-action flex-column align-items-start"
                key={i}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1" style={{ fontSize: "0.9rem" }}>
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
          <button
            className="btn btn-outline-primary mt-3"
            disabled={disable}
            onClick={() => setShowReviewModal(!showReviewModal)}
          >
            Add Review
          </button>
        </div>
      )}
    </>
  );
};

export default HawkerRev;
