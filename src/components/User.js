import React, { useEffect, useState } from "react";
import { backendApi } from "../urlConfig";
import HawkerCard from "./HawkerCard";
import UserNavbar from "./UserNavbar";
import { Routes, Route } from "react-router-dom";
import About from "./About";
import UserProtectedRoute from "./UserProtectedRoute";

const User = () => {
  const [hawkers, setHawkers] = useState([]);
  const [fhawkers, setfHawkers] = useState([]);
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
  // implement location update here

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
        if (data.ok) {
          setFav(data.data.favorites);
          data.data.favorites.forEach((e) =>
            setFavid((favid) => [...favid, e._id.toString()])
          );
          // console.log(favid);
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
      const rsp = await fetch(`${backendApi}/hawker/allhawkers`, {
        method: "GET",
      });
      const data = await rsp.json();
      setLoading(0);
      setHawkers(data.data);
      setfHawkers(data.data);
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
  const renderFirstPage = (dataa) => {
    // console.log(dataa);
    return (
      <>
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <div className="container fluid mt-4">
            {dataa.length === 0 ? (
              <h1>No Hawker Found</h1>
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
  const resetHaw=()=>{
    setfHawkers(hawkers);
  }
  const search=(data)=>{
    setfHawkers(data);
  }
  const changeLoading=(val)=>{
    setLoading(val);
  }
  const changeCategory = (cat) => {
    Array.from(cat).forEach((e) => {
      if (e.checked) catFil[e.value] = true;
      else catFil[e.value] = false;
    });
    setCatFil(catFil);

    let arr1 = hawkers.filter((e) => catFil[e.category]);
    if (arr1.length > 0) setfHawkers(arr1);
    else setfHawkers(hawkers);
  };
  return (
    <>
      <UserNavbar
        token={userToken}
        username={username}
        changeUser={(userTkn, usernm) => updateState(userTkn, usernm)}
        changeCat={(e) => changeCategory(e)}
        search={(d)=>search(d)}
        changeLoad={(val)=>changeLoading(val)}
        resetHawker={()=>resetHaw()}
      />

      <Routes>
        <Route path="/" element={renderFirstPage(fhawkers)} />
        <Route element={<UserProtectedRoute isLog={username} />}>
          <Route exact path="/userfav" element={renderFirstPage(fav)} />
          <Route exact path="/about" element={<About />} />
        </Route>
      </Routes>
    </>
  );
};

export default User;
