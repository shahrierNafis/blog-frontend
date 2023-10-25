import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import AccountCTRL from "../components/AccountCTRL";
function Layout() {
  const api = "http://localhost:3000/v1/";
  const token = JSON.parse(localStorage.getItem("token")) || {};
  return (
    <>
      <Container className="flex flex-column vh-100">
        {/* nav */}
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">BLOG</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <LinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
              </Nav>
              <AccountCTRL token={token} api={api}></AccountCTRL>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/* content */}
        <Container id="Outlet" className="flex flex-column flex-grow-1 p-0">
          <Outlet context={{ api, token }}></Outlet>
        </Container>
      </Container>
    </>
  );
}

export default Layout;
