import React, { useEffect, useState } from "react";
import { backendApi } from "../urlConfig";
import HawkerCard from "./HawkerCard";
import UserNavbar from "./UserNavbar";

const User = () => {
  const [hawkers, setHawkers] = useState([]);
  const [loading, setLoading] = useState(0);
  const [userToken, setUserToken] = useState("");
  const [username, setUsername] = useState("");
  // implement location update here
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
      // console.log(data.data);
    };
    getHawkers();
  }, []);
  const updateState = (usertkn, usernm) => {
    // console.log(usertkn, usernm)
    setUserToken(usertkn);
    setUsername(usernm);
  };
  return (
    <>
      <UserNavbar
        token={userToken}
        username={username}
        changeUser={(userTkn, usernm) => updateState(userTkn, usernm)}
      />
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="container fluid mt-4">
          {hawkers.length === 0 ? (
            <h1>No Hawker Found</h1>
          ) : (
            <div className="row">
              {hawkers.map((e) => {
                return <HawkerCard data={e} username={username} token={userToken}/>;
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default User;
