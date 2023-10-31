import Card from "react-bootstrap/Card";
import parse from "html-react-parser";

import PropTypes from "prop-types";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import "highlight.js/styles/obsidian.css";
import hljs from "highlight.js";

/**
 * Component for rendering a post.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.post - The post object.
 * @param {Function} props.UpdateToken - The function for updating the token.
 * @param {Object} props.token - The token object.
 * @param {Array} props.posts - The array of posts.
 * @param {Function} props.setPosts - The function for updating the posts array.
 * @returns {ReactElement} The rendered post component.
 */
function Post({ post, UpdateToken, token, posts, setPosts }) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const navigate = useNavigate();

  // Remove the title from the post text
  const textWithoutTitle = post.text
    .replace(`${post.title}`, "")
    .replace("<h1></h1>", "");

  /**
   * Publishes the post.
   * Updates the token and sends a PUT request to update the post state to "published".
   */
  async function publish() {
    await UpdateToken();
    await fetch(`${import.meta.env.VITE_api}posts/${post._id}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state: "published",
      }),
    });
    post.state = "published";
    forceUpdate();
  }

  /**
   * Sets the post state to "draft".
   * Updates the token and sends a PUT request to update the post state to "draft".
   */
  async function draft() {
    await UpdateToken();
    await fetch(`${import.meta.env.VITE_api}posts/${post._id}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state: "draft",
      }),
    });
    post.state = "draft";
    forceUpdate();
  }

  /**
   * Removes the post.
   * Updates the token and sends a DELETE request to remove the post.
   * Updates the posts array by removing the deleted post.
   */
  async function remove() {
    await UpdateToken();
    await fetch(`${import.meta.env.VITE_api}posts/${post._id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    setPosts(posts.filter((p) => p._id !== post._id));
  }

  /**
   * Navigates to the post edit page.
   */
  async function edit() {
    navigate(`/post/${post._id}/edit`);
  }

  useEffect(() => {
    hljs.highlightAll();
  });

  return (
    <>
      <Card className="max-h-64 m-2 overflow-y-scroll">
        <Card.Body>
          <Card.Title>
            <div className="flex align-items-center">
              <LinkContainer to={`/post/${post._id}`}>
                <span className="hover:text-sky-500 text-5xl">
                  {parse(post.title)}
                </span>
              </LinkContainer>
              {post && (
                <Button variant="danger" onClick={remove} className="ml-auto ">
                  Delete
                </Button>
              )}
              {post && post.state == "draft" && (
                <Button variant="primary" onClick={publish} className="m-2">
                  Publish
                </Button>
              )}
              {post && post.state == "published" && (
                <Button variant="primary" onClick={draft} className="m-2">
                  Draft
                </Button>
              )}
              {post && (
                <Button variant="primary" onClick={edit} className="">
                  Edit
                </Button>
              )}
            </div>
          </Card.Title>

          <Card.Text>{parse(textWithoutTitle)}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
Post.propTypes = {
  post: PropTypes.object,
  UpdateToken: PropTypes.func,
  token: PropTypes.object,
  posts: PropTypes.array,
  setPosts: PropTypes.func,
};
export default Post;
