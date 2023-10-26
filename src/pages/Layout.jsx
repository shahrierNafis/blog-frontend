import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import AccountCTRL from "../components/AccountCTRL";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Layout() {
  const token = JSON.parse(localStorage.getItem("token")) || {};
  const navigate = useNavigate();

  async function fetcher(url, options) {
    try {
      const decodedAccToken = jwt_decode(token.accessToken);
      const decodedRefToken = jwt_decode(token.refreshToken);
      // check if access token is expired
      if (decodedAccToken.exp * 1000 < new Date().getTime()) {
        // if expired refresh token
        // check if refresh token is expired
        if (decodedRefToken.exp * 1000 > new Date().getTime()) {
          const res = await fetch(`${import.meta.env.VITE_api}refresh-token`, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token.refreshToken,
            }),
          });
          // if any error occurs logout
          if (!res.ok) {
            navigate("/logout");
          } else {
            // if ok update token
            const { accessToken, refreshToken } = await res.json();
            token.accessToken = accessToken;
            token.refreshToken = refreshToken;
            localStorage.setItem("token", JSON.stringify(token));
            console.log("token updated");
          }
        } else {
          // if refresh token is expired logout
          navigate("/logout");
        }
      }
      return fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
    } catch (error) {
      // if any error occurs logout
      navigate("/logout");
    }
  }
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
              <AccountCTRL token={token}></AccountCTRL>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/* content */}
        <Container id="Outlet" className="flex flex-column flex-grow-1 p-0">
          <Outlet context={{ token, fetcher }}></Outlet>
        </Container>
      </Container>
    </>
  );
}

export default Layout;
