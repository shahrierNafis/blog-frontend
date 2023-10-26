import { useEffect } from "react";
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
      {Object.keys(token).length ? (
        <ButtonGroup>
          <LinkContainer to="/create-post">
            <Button variant="dark">Add Post</Button>
          </LinkContainer>
          <LinkContainer to="/account" className="">
            <Button variant="dark" className="">
              My Account
            </Button>
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
