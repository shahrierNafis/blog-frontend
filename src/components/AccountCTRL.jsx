import { useEffect } from "react";
import { Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { LinkContainer } from "react-router-bootstrap";
import PropTypes from "prop-types";

function AccountCTRL({ api, token }) {
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      {token ? (
        <ButtonGroup>
          <LinkContainer to="/create-post">
            <Button variant="dark">Add Post</Button>
          </LinkContainer>
          <LinkContainer to="/account">
            <Button variant="dark">My Account</Button>
          </LinkContainer>
        </ButtonGroup>
      ) : (
        <ButtonGroup>
          <LinkContainer to="/sign-up">
            <Button variant="dark">Sign Up</Button>
          </LinkContainer>
          <LinkContainer to="/login">
            <Button variant="dark">Login</Button>
          </LinkContainer>
        </ButtonGroup>
      )}
    </>
  );
}
AccountCTRL.propTypes = {
  api: PropTypes.string,
  token: PropTypes.object,
};
export default AccountCTRL;
