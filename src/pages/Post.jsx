import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import parse from "html-react-parser";
import AddComments from "../components/AddComments";
import Comment from "../components/Comment";
import "highlight.js/styles/obsidian.css";
import hljs from "highlight.js";

/**
 * This function is responsible for rendering a post and its associated comments.
 * It fetches the post data and comments from the API and updates the state accordingly.
 *
 * @returns A JSX element containing the post and comments.
 */
function Post() {
  const { id } = useParams();
  const { UpdateToken, token } = useOutletContext();
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  /**
   * Fetches the post data from the API and updates the state.
   */
  useEffect(() => {
    (async () => {
      await UpdateToken();
      const response = await fetch(`${import.meta.env.VITE_api}posts/${id}`, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
      const post = await response.json();
      setPost(post);
    })();

    return () => {};
  }, [UpdateToken, token, id]);

  /**
   * Fetches the comments data from the API and updates the state, if the post data is available.
   */
  useEffect(() => {
    if (post) {
      (async () => {
        await UpdateToken();
        const response = await fetch(
          `${import.meta.env.VITE_api}posts/${id}/comments`,
          {
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );
        const comments = await response.json();
        setComments(comments);
      })();
    }

    return () => {};
  }, [UpdateToken, token, id, post]);

  /**
   * Highlights all code blocks using the `hljs` library.
   */
  useEffect(() => {
    hljs.highlightAll();
  });

  return (
    <>
      {post && <span>{parse(post.text)}</span>}
      <AddComments
        UpdateToken={UpdateToken}
        token={token}
        id={id}
        comments={comments}
        setComments={setComments}
      ></AddComments>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          id={comment._id}
          comment={comment}
          UpdateToken={UpdateToken}
          token={token}
          comments={comments}
          setComments={setComments}
        ></Comment>
      ))}
    </>
  );
}

export default Post;
