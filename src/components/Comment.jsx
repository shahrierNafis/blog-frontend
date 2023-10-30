import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function Comment({ comment, UpdateToken, token, setComments, comments }) {
  const [author, setAuthor] = useState();
  const [user, setUser] = useState();
  useEffect(() => {
    (async () => {
      await UpdateToken();
      setAuthor(
        await (
          await fetch(`${import.meta.env.VITE_api}users/${comment.author}`, {
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })
        ).json()
      );
    })();

    return () => {};
  }, [UpdateToken, token, comment]);
  async function remove() {
    await UpdateToken();
    await fetch(`${import.meta.env.VITE_api}comments/${comment._id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    setComments(comments.filter((c) => c._id !== comment._id));
  }
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
  return (
    <>
      {author && (
        <div>
          {user && comment.author === user._id && (
            <span className="text-red-500" onClick={remove}>
              X
            </span>
          )}{" "}
          {author.username}: {comment.text}
        </div>
      )}
    </>
  );
}
Comment.propTypes = {
  token: PropTypes.object,
  UpdateToken: PropTypes.func,
  comment: PropTypes.object,
  setComments: PropTypes.func,
  comments: PropTypes.array,
};
export default Comment;
