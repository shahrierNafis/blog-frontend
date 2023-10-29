import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { LinkContainer } from "react-router-bootstrap";
import PropTypes from "prop-types";

function AccountCTRL({ token, UpdateToken }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    // check if token exists
    //or will cause loop
    Object.keys(token).length &&
      (async () => {
        await UpdateToken();
        setUser(
          await (
            await fetch(`${import.meta.env.VITE_api}users/me`, {
              mode: "cors",
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            })
          ).json()
        );
      })();

    return () => {};
  }, [token, UpdateToken]);
  return (
    <>
      {/* if token exists */}
      {Object.keys(token).length ? (
        <ButtonGroup>
          {["admin", "editor", "author"].includes(user.role) && (
            <LinkContainer to="/create-post">
              <Button variant="dark">Add Post</Button>
            </LinkContainer>
          )}
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
  token: PropTypes.object,
  UpdateToken: PropTypes.func,
};
export default AccountCTRL;
