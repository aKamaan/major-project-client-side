import React from 'react'
import {Navbar,Container,Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {frontendApi} from '../urlConfig'
const NavbarHawker = () => {
    const name=localStorage.getItem('name');
    const handleLogout=()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('name');
        window.location.assign(`${frontendApi}/login`);
    }
  return (
         <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand style={{height:'40px'}}><Link to='/hawker' style={{"textDecoration":"none","color":"white",textTransform:'capitalize'}}>{name}</Link></Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link><Link to="/hawker/profile" style={{"textDecoration":"none","color":"grey"}}>Profile</Link></Nav.Link>
              <Nav.Link><Link to="/hawker/inventory" style={{"textDecoration":"none","color":"grey"}}>Inventory</Link></Nav.Link>
              <Nav.Link><Link to="/hawker/about" style={{"textDecoration":"none","color":"grey"}}>About</Link></Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
            </Container>
          </Navbar>
  )
}

export default NavbarHawker