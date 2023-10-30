import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
function AddComments({ UpdateToken, token, id, comments, setComments }) {
  const [user, setUser] = useState();
  const comment = useRef();
  useEffect(() => {
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
  }, [UpdateToken, token]);
  async function Add() {
    await UpdateToken();
    if (comment.current.value.trim() == "") {
      return;
    }
    setComments([
      ...comments,
      await (
        await fetch(`${import.meta.env.VITE_api}posts/${id}/comments`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
          body: JSON.stringify({
            text: comment.current.value,
            author: user._id,
            post: id,
          }),
        })
      ).json(),
    ]);
  }
  return (
    <>
      {user && (
        <Form className="w-100">
          <Form.Group className="mb-3" controlId="comment">
            <FloatingLabel>
              <Form.Control ref={comment} name="comment" type="text" />
              <Form.Label>comment</Form.Label>
            </FloatingLabel>
          </Form.Group>
          <Button onClick={Add}>Add</Button>
        </Form>
      )}
    </>
  );
}
AddComments.propTypes = {
  token: PropTypes.object,
  UpdateToken: PropTypes.func,
  id: PropTypes.string,
  comments: PropTypes.array,
  setComments: PropTypes.func,
};
export default AddComments;
