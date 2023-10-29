import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

function Home() {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_api}posts`, { mode: "cors" })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((rejected) => {
        console.log(rejected);
      });
    return () => {};
  }, []);
  return (
    <>
      {posts && posts.length > 0
        ? posts.map((post) => (
            <LinkContainer key={post._id} to={`/post/${post._id}`}>
              <h1 className="hover:text-sky-500">{"->" + post.title}</h1>
            </LinkContainer>
          ))
        : "loading..."}
    </>
  );
}

export default Home;
