import React, { useEffect, useState } from "react";
import { backendApi } from "../urlConfig";

const HawkerInv = (props) => {
  const [inv, setInv] = useState([]);
  useEffect(() => {
    const getInv = async () => {
      const rsp = await fetch(`${backendApi}/hawker/getinv/${props.data._id}`, {
        method: "GET",
      });
      const data = await rsp.json();
      if (data.inv) {
        setInv(data.inv.items);
        // console.log(data);
      }else{
        setInv([]);
      }
    };
    getInv();
  }, [props.data._id]);

  return (
    <>
      <div className="tableFixHead mt-2">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Items</th>
              <th>Price</th>
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
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">
                  <strong>Nothing Is Here..</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HawkerInv;
