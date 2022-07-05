import React, { useEffect, useState } from "react";
import { backendApi } from "../urlConfig";
import HawkerCard from "./HawkerCard";
import UserNavbar from "./UserNavbar";
import { Routes, Route, Link } from "react-router-dom";
import UserProtectedRoute from "./UserProtectedRoute";
import { Breadcrumb, Form, Button } from "react-bootstrap";
import Loading from "./Loading";

const User = () => {
  const [hawkers, setHawkers] = useState([]);
  const [fhawkers, setfHawkers] = useState([]);
  const [email, setEmail] = useState("");
  const [catFil, setCatFil] = useState({
    "Fruit Seller": false,
    "Ice Cream Seller": false,
    "Vegetable Seller": false,
    "Street Food": false,
    "Service Provider": false,
  });
  const [loading, setLoading] = useState(0);
  const [userToken, setUserToken] = useState("");
  const [username, setUsername] = useState("");
  const [fav, setFav] = useState([]);
  const [favid, setFavid] = useState([]);
  const [ratingMap, setRatingMap] = useState({});
  const [loader, setLoader] = useState(0);
  // implement location update here

  useEffect(() => {
    if (userToken) {
      const getEmail = async () => {
        const rsp = await fetch(`${backendApi}/user/info`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${userToken}`,
          },
        });
        const data = await rsp.json();
        if (data.ok) {
          setEmail(data.user.email);
          // console.log(data);
        } else setEmail("");
      };
      getEmail();
    }
  }, [userToken]);
  useEffect(() => {
    if (userToken) {
      const getFav = async () => {
        const rsp = await fetch(`${backendApi}/user/getfav`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${userToken}`,
          },
        });
        const data = await rsp.json();
        // console.log(data.data)
        if (data.ok && data.data) {
          setFav(data.data.favorites);
          const arr = [];
          data.data.favorites.forEach((e) => arr.push(e._id.toString()));
          setFavid(arr);
          // console.log(favid);
        } else {
          setFav([]);
          setFavid([]);
        }
      };
      getFav();
    }
  }, [userToken]);
  useEffect(() => {
    const t1 = localStorage.getItem("userToken");
    if (t1 === null) setUserToken("");
    else setUserToken(t1);
    const t2 = localStorage.getItem("username");
    if (t2 === null) setUsername("");
    else setUsername(t2);
  }, []);
  useEffect(() => {
    if (userToken !== "") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (res) => {
            // console.log(res.coords.latitude,res.coords.longitude)
            const location = async () => {
              await fetch(`${backendApi}/user/updatelocation`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `bearer ${userToken}`,
                },
                body: JSON.stringify({
                  lat: res.coords.latitude,
                  long: res.coords.longitude,
                }),
              });
            };
            location();
          },
          (err) => {}
        );
      } else {
        console.log("location not supprted");
      }
    }
  }, [userToken, username]);

  useEffect(() => {
    const getHawkers = async () => {
      setLoading(1);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (res) => {
            // console.log(res.coords.latitude,res.coords.longitude)
            const location = async () => {
              const rsp = await fetch(`${backendApi}/hawker/allhawkers`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  lat: res.coords.latitude,
                  long: res.coords.longitude,
                }),
              });
              const data = await rsp.json();
              setLoading(0);
              setHawkers(data.data);
              setfHawkers(data.data);
            };
            location();
          },
          (err) => {}
        );
      } else {
        console.log("location not supprted");
      }

      // console.log(data.data);
    };
    getHawkers();
  }, []);
  const updateState = (usertkn, usernm) => {
    // console.log(usertkn, usernm)
    setUserToken(usertkn);
    setUsername(usernm);
  };
  const delFav = async (id) => {
    const rsp = await fetch(`${backendApi}/user/deletefav`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${userToken}`,
      },
      body: JSON.stringify({ favorites: id }),
    });
    const data = await rsp.json();
    if (data.ok) {
      setFav(data.rsp.favorites);
      let temp = [];
      data.rsp.favorites.forEach((e) => temp.push(e._id.toString()));
      setFavid(temp);
    }
  };
  const addFav = async (id) => {
    const rsp = await fetch(`${backendApi}/user/addfav`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${userToken}`,
      },
      body: JSON.stringify({ favorites: id }),
    });
    const data = await rsp.json();
    if (data.ok) {
      setFav(data.rsp.favorites);
      let temp = [];
      data.rsp.favorites.forEach((e) => temp.push(e._id.toString()));
      setFavid(temp);
    }
  };
  const setRating = (id, rat) => {
    ratingMap[id] = parseFloat(rat);
    setRatingMap(ratingMap);
  };
  const renderFirstPage = (dataa, nav) => {
    // console.log(dataa);
    return (
      <>
        {nav ? (
          <UserNavbar
            token={userToken}
            username={username}
            changeUser={(userTkn, usernm) => updateState(userTkn, usernm)}
            changeCat={(e) => changeCategory(e)}
            search={(d) => search(d)}
            changeLoad={(val) => changeLoading(val)}
            resetHawker={() => resetHaw()}
            sortRating={(d, arr, str) => sortByRating(d, arr, str)}
            sortPrice={(d, arr, str) => sortByPrice(d, arr, str)}
            h={fhawkers}
            email={email}
            changeEmail={(e) => setEmail(e)}
          />
        ) : (
          <>
            <div className="container my-3">
              <Breadcrumb
                style={{
                  backgroundColor: "white",
                  padding: "7px 20px",
                  borderRadius: "5px",
                  marginBottom: "0",
                }}
              >
                <Breadcrumb.Item>
                  <Link
                    to="/user"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Home
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                  <Link
                    to="/user/userfav"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Favorites
                  </Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </>
        )}
        {loading ? (
          <>
            <Loading size="6x" />
          </>
        ) : (
          <div className="container fluid mt-4">
            {dataa.length === 0 ? (
              <h1>No Hawker Found...</h1>
            ) : (
              <div className="row">
                {dataa.map((e, i) => {
                  return (
                    <HawkerCard
                      data={e}
                      username={username}
                      token={userToken}
                      favid={favid}
                      delfav={(id) => delFav(id)}
                      addfav={(id) => addFav(id)}
                      key={i}
                      setRating={(id, rat) => setRating(id, rat)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </>
    );
  };
  const resetHaw = () => {
    setfHawkers(hawkers);
  };
  const search = (data) => {
    setfHawkers(data);
  };
  const changeLoading = (val) => {
    setLoading(val);
  };
  const changeCategory = (cat) => {
    let flag = 0;
    Array.from(cat).forEach((e) => {
      if (e.checked) {
        catFil[e.value] = true;
        flag = 1;
      } else catFil[e.value] = false;
    });
    setCatFil(catFil);

    let arr1 = hawkers.filter((e) => catFil[e.category]);
    if (!flag) setfHawkers([...hawkers]);
    else {
      setfHawkers([...arr1]);
    }
  };
  const sortByRating = (flag, cat, item) => {
    if (!flag) {
      setfHawkers(fhawkers);
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (res) => {
            const sortRat = async () => {
              setLoading(1);
              const rsp = await fetch(`${backendApi}/hawker/sortbyrating`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  lat: res.coords.latitude,
                  long: res.coords.longitude,
                  cat,
                  item,
                }),
              });
              const data = await rsp.json();
              setLoading(0);
              if (data.ok) {
                setfHawkers(data.rsp1);
              }
            };
            sortRat();
          },
          (err) => {
            alert("Location not supported");
          }
        );
      }
    }
  };
  const sortByPrice = (flag, cat, item) => {
    if (flag) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (res) => {
            // console.log(res.coords.latitude,res.coords.longitude)
            const sortPr = async () => {
              setLoading(1);
              const rsp = await fetch(`${backendApi}/hawker/sortbyprice`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  lat: res.coords.latitude,
                  long: res.coords.longitude,
                  cat,
                  item,
                }),
              });
              const data = await rsp.json();
              setLoading(0);
              if (data.ok) {
                setfHawkers(data.data);
                // console.log(data.data);
              }
            };
            sortPr();
          },
          (err) => {
            alert("Location not supported");
          }
        );
      }
    }
  };
  const handleReset = (e) => {
    e.preventDefault();
    const password = e.target[0].value;
    if (password.length < 6) alert("Password must me 6 characters long");
    const token = window.location.pathname.split("/")[3];
    setLoader(1);
    const post = async () => {
      const rsp = await fetch(`${backendApi}/user/forgotpassword`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });
      const data = await rsp.json();
      setLoader(0);
      if (data.ok) {
        alert('Your password has been updated successfuly you can close this page and login again');
        // console.log(data.data);
      }
    };
    post();
  };
  const renderResetForm = () => {
    return (
      <div
        className="container"
        style={{ width: "max-content", margin: "2rem auto" }}
      >
        <Form onSubmit={handleReset}>
          <Form.Group className="mb-3" controlId="formBasic4">
            <Form.Label>New Password(Must me 6 characters long)</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your new password"
              required
            />
          </Form.Group>
          {loader ? (
            <Button variant="primary" disabled={true} style={{width:'64.05px',height:'38px'}}>
              <Loading size="lg" />
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Reset
            </Button>
          )}
        </Form>
      </div>
    );
  };
  return (
    <>
      <Routes>
        <Route path="/" element={renderFirstPage(fhawkers, 1)} />
        <Route path="/reset/:token" element={renderResetForm()} />
        <Route element={<UserProtectedRoute isLog={username} />}>
          <Route exact path="/userfav" element={renderFirstPage(fav, 0)} />
          {/* <Route exact path="/about" element={<About />} /> */}
        </Route>
      </Routes>
    </>
  );
};

export default User;
