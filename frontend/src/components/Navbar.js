// frontend/src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { isTokenValid, removeToken } from '../utils/auth';

function AppNavbar() {
  const navigate = useNavigate();
  const isAuthenticated = isTokenValid();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">My Full Stack Project</Navbar.Brand>
        
        {/* This is the hamburger button that appears on mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* This is the collapsible section */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/students">Students</Nav.Link>
                <Nav.Link as={Link} to="/add-student">Add Student</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated && (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;