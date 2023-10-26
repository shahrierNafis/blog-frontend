import { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { json, useNavigate, useOutletContext } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function Login() {
  const { token } = useOutletContext();
  const email = useRef();
  const password = useRef();
  const [errors, setErrors] = useState();
  const navigate = useNavigate();

  async function handleClick() {
    // Post login up request
    const response = await fetch(`${import.meta.env.VITE_api}login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email.current.value,
        password: password.current.value,
      }),
    });
    // Check response
    if (response.ok) {
      let { accessToken, refreshToken } = await response.json();
      token.accessToken = accessToken;
      token.refreshToken = refreshToken;
      // Save token in local storage
      localStorage.setItem("token", JSON.stringify(token));
      navigate("/");
    } else {
      console.log(response);
      // Get errors
      response.json().then((data) => {
        setErrors(data.errors);
      });
    }
  }
  function visibility(e) {
    password.current.type = e.target.checked ? "text" : "password";
  }
  return (
    <>
      <Container className="flex flex-column flex-grow-1 p-0">
        <Row className="flex-grow-1 justify-center ">
          <Col md={6} className="align-self-center p-0">
            {/* Sign UP form */}
            <Form className="w-100">
              <Form.Group className="mb-3" controlId="username">
                <FloatingLabel>
                  {/* email */}
                  <Form.Control
                    ref={email}
                    name="username"
                    type="text"
                    placeholder="UserName"
                  />
                  <Form.Label>UserName</Form.Label>
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <FloatingLabel>
                  {/* password */}
                  <Form.Control
                    ref={password}
                    name="password"
                    type="password"
                    placeholder="********"
                  />
                  <Form.Label>password</Form.Label>
                </FloatingLabel>
                <Form.Check
                  onChange={visibility}
                  type="checkbox"
                  label="show password"
                />
              </Form.Group>
            </Form>
            {/* button */}
            <Button className="mb-3" onClick={handleClick}>
              Login
            </Button>
            {/* errors */}
            {errors &&
              errors.map((error) => (
                <Alert key={error.message} variant={"warning"}>
                  {error.msg}
                </Alert>
              ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
