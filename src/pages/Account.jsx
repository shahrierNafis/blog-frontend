import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Post from "../components/Post";

function Account() {
  const { token, UpdateToken } = useOutletContext();
  const [user, setUser] = useState();
  const [posts, setPosts] = useState();
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
  useEffect(() => {
    (async () => {
      if (user) {
        await UpdateToken();
        setPosts(
          await (
            await fetch(
              `${import.meta.env.VITE_api}posts?author=${user._id}&draft=true`,
              {
                mode: "cors",
                headers: {
                  Authorization: `Bearer ${token.accessToken}`,
                },
              }
            )
          ).json()
        );
      }
    })();

    return () => {};
  }, [user, token.accessToken, UpdateToken]);

  return (
    <>
      {user ? <h1>{user.username}</h1> : "loading..."}
      <LinkContainer to="/logout" className="w-fit	">
        <Button variant="secondary">Logout</Button>
      </LinkContainer>
      {posts && posts.length > 0
        ? posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              UpdateToken={UpdateToken}
              token={token}
            />
          ))
        : "loading..."}
    </>
  );
}

export default Account;
