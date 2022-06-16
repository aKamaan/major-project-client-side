import {Link} from "react-router-dom"

function Header() {
  const style2={
    position:"absolute",
    left:"50%",
    top:"50%",
    transform:"translate(-50%,-50%)"
  }
  return (
    <>
    <div style={style2}>
      <Link to="/user"><button className="submit-feedback">USER</button></Link>
      <Link to="/hawker"><button className="submit-feedback">HAWKER</button></Link>
    </div>
    </>
  );
}

export default Header;