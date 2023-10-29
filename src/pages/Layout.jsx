import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import AccountCTRL from "../components/AccountCTRL";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

function Layout() {
  const token = JSON.parse(localStorage.getItem("token")) || {};
  const navigate = useNavigate();
  const pendingUpdate = useRef();

  async function UpdateToken() {
    // check if token exists
    if (!token.refreshToken) {
      // if not redirect to login
      navigate("/login");
    } else {
      const decodedAccToken = jwt_decode(token.accessToken);
      const decodedRefToken = jwt_decode(token.refreshToken);
      // check if update is pending
      if (pendingUpdate.current) {
        return pendingUpdate.current;
      } else {
        // check if access token is expired
        if (decodedAccToken.exp * 1000 < new Date().getTime()) {
          // check if refresh token is expired
          if (decodedRefToken.exp * 1000 > new Date().getTime()) {
            // if not, start updating token
            pendingUpdate.current = fetch(
              `${import.meta.env.VITE_api}refresh-token`,
              {
                method: "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: token.refreshToken,
                }),
              }
            )
              .then((res) => {
                // if any error occurs logout
                if (!res.ok) {
                  navigate("/logout");
                } else {
                  return res.json();
                }
              })
              .then((json) => {
                // if ok update token
                token.accessToken = json.accessToken;
                token.refreshToken = json.refreshToken;
                localStorage.setItem("token", JSON.stringify(token));
              })
              .finally(() => {
                // done updating
                delete pendingUpdate.current;
              });
            return pendingUpdate.current;
          } else {
            // Refresh token is expired, logout
            navigate("/logout");
          }
        } else {
          return true;
        }
      }
    }
  }

  return (
    <>
      <Container className="fluid flex flex-column vh-100">
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
              <AccountCTRL
                token={token}
                UpdateToken={UpdateToken}
              ></AccountCTRL>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/* content */}
        <Container id="Outlet" className="flex flex-column flex-grow-1 p-0">
          <Outlet context={{ token, UpdateToken }}></Outlet>
        </Container>
      </Container>
    </>
  );
}

export default Layout;
