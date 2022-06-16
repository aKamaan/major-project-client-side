import React from 'react'
import {Navbar,Container,Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';

const NavbarHawker = () => {
    const name=localStorage.getItem('name');
    const handleLogout=()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('name');
        window.location.assign("http://localhost:5000/login");
    }
  return (
         <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand style={{height:'40px'}}><Link to='/hawker' style={{"textDecoration":"none","color":"white",textTransform:'capitalize'}}>{name}</Link></Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link><Link to="/hawker/profile" style={{"textDecoration":"none","color":"grey"}}>Profile</Link></Nav.Link>
              <Nav.Link><Link to="/hawker/inventory" style={{"textDecoration":"none","color":"grey"}}>Inventory</Link></Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
            </Container>
          </Navbar>
  )
}

export default NavbarHawker