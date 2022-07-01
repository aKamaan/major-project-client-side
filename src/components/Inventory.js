import { useEffect, useState } from "react";
import {
  Table,
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import Login from "./Login";
import NavbarHawker from "./NavbarHawker";
import { backendApi } from "../urlConfig";

const Inventory = () => {
  const [deletedItems, setdeletedItems] = useState([]);
  const [user, setUser] = useState("");
  const [disable, setDisabled] = useState(true);
  const [loading, setLoading] = useState(0);
  const [inv, setInv] = useState([]);
  const [show, setShow] = useState(0);
  const [cat, setCat] = useState("");
  const handleClose = () => setShow(!show);

  useEffect(() => {
    const tkn = localStorage.getItem("user");
    if (tkn) setUser(tkn);
    if (user) {
      const getItems = async () => {
        setLoading(1);
        const rsp = await fetch(`${backendApi}/hawker/getitem`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${user}`,
          },
        });
        const data = await rsp.json();
        setLoading(0);
        if(data.inv)
            setInv(data.inv.items);
        const rsp1=await fetch(`${backendApi}/hawker/profile`,{
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `bearer ${user}`,
            }
        });
        const data1=await rsp1.json();
        setCat(data1.category)
        
      };
      getItems();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const str1 = e.target[0].value,
    str2 = e.target[1].value;
    const str3=e.target[2].value;
    var matches = str2.match(/(\d+)/);
    console.log(matches)
    if (str1 === "" || str2 === "") alert("Please enter all values");
    else {
      let items = [];
      items.push({ name: str1, price: matches[0]+" Rs" +str3 });
      const rsp = await fetch(`${backendApi}/hawker/additem`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${user}`,
        },
        body: JSON.stringify({ items }),
      });
      const data = await rsp.json();
      // console.log(data);
      setInv(data.items);
    }
  };

  const handleDelete = async () => {
    setDisabled(true);
    // console.log(deletedItems)
    const rsp = await fetch(`${backendApi}/hawker/deleteitem`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${user}`,
      },
      body: JSON.stringify(deletedItems),
    });
    const data = await rsp.json();
    // console.log(data);
    setInv(data.data.items);
  };
  const enableButton = () => {
    const arr = document.getElementsByClassName("cb");
    let arr1 = [];
    Array.from(arr).forEach((e) => {
      if (e.checked) arr1.push(e.id);
    });

    setdeletedItems(arr1);
    if (arr1.length > 0) setDisabled(false);
    else setDisabled(true);
  };
  const renderUnit = () => {
    if (cat === "Fruit Seller") {
      return (
        <Form.Group className="mb-3" controlId="formBasicCat1">
          <Form.Label>Unit</Form.Label>
          <Form.Select aria-label="Default select example">
            <option value="/Kg">/Kg</option>
          </Form.Select>
        </Form.Group>
      );
    } else if (cat === "Vegetable Seller") {
      return (
        <Form.Group className="mb-3" controlId="formBasicCat2">
          <Form.Label>Unit</Form.Label>
          <Form.Select aria-label="Default select example">
            <option value="/Kg">/Kg</option>
            <option value="/gm">/gm</option>
          </Form.Select>
        </Form.Group>
      );
    } else if (cat === "Street Food") {
      return (
        <Form.Group className="mb-3" controlId="formBasicCat3">
          <Form.Label>Unit</Form.Label>
          <Form.Select aria-label="Default select example">
            <option value="/serve">/serve</option>
          </Form.Select>
        </Form.Group>
      );
    } else if (cat === "Ice Cream Seller") {
      return (
        <Form.Group className="mb-3" controlId="formBasicCat4">
          <Form.Label>Unit</Form.Label>
          <Form.Select aria-label="Default select example">
            <option value="on MRP">on MRP</option>
          </Form.Select>
        </Form.Group>
      );
    } else {
      return (
        <Form.Group className="mb-3" controlId="formBasicCat5">
          <Form.Label>Unit</Form.Label>
          <Form.Select aria-label="Default select example">
            <option value="/hr">/hr</option>
          </Form.Select>
        </Form.Group>
      );
    }
  };
  if (user === "") return <Login />;
  else {
    return (
      <>
        <NavbarHawker />
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Items To your Inventory</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Item Name" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="text" placeholder="Enter Price" />
                  </Form.Group>
                </Col>
                <Col>{renderUnit()}</Col>
              </Row>

              <Button
                variant="secondary"
                onClick={handleClose}
                className="mx-3"
              >
                Close
              </Button>
              <Button variant="primary" type="submit" onClick={handleClose}>
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Container fluid>
          {loading ? (
            <h4>Loading...</h4>
          ) : (
            <Table
              striped
              bordered
              hover
              style={{
                width: "60%",
                textTransform: "capitalize",
                textAlign: "center",
              }}
              className="mx-auto my-5"
            >
              <thead style={{ backgroundColor: "black", color: "white" }}>
                <tr>
                  <th>S.No</th>
                  <th>Items</th>
                  <th>Price(in Rs)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inv.length > 0 ? (
                  inv.map((e, i) => {
                    return (
                      <tr key={i} id={i + 1}>
                        <td>{i + 1}</td>
                        <td>{e.name}</td>
                        <td>{e.price}</td>
                        <td>
                          <input
                            type="checkbox"
                            id={e._id}
                            onChange={enableButton}
                            className="cb"
                          ></input>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4">
                      <strong>
                        You dont have anything here Please add items
                      </strong>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
          <div
            className="mx-auto"
            style={{ width: "60%", textAlign: "center" }}
          >
            <Button onClick={handleClose} className="m-2">
              Add Items
            </Button>
            <Button
              className="mx-3"
              variant="danger"
              disabled={disable}
              id="dlt-btn"
              onClick={handleDelete}
            >
              Delete Items
            </Button>
          </div>
        </Container>
      </>
    );
  }
};

export default Inventory;
