import Card from "react-bootstrap/Card";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";

function Post({ post, UpdateToken, token, posts, setPosts }) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const navigate = useNavigate();
  const textWithoutTitle = post.text
    .replace(post.title, "")
    .replace("<h1></h1>", "");
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
  async function edit() {
    navigate(`/post/${post._id}/edit`);
  }
  return (
    <>
      <Card className="max-h-64	 m-2 overflow-y-scroll">
        <Card.Body>
          <Card.Title>
            {" "}
            <div className="flex align-items-center">
              <LinkContainer to={`/post/${post._id}`}>
                <span className="hover:text-sky-500 text-5xl">
                  {post.title}
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
