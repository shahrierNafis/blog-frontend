import React from "react";
import { useOutletContext } from "react-router-dom";

function Home() {
  const { api } = useOutletContext();
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    fetch(`${api}posts`, { mode: "cors" })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((rejected) => {
        console.log(rejected);
      });
    return () => {};
  }, [api]);
  return (
    <>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </>
  );
}

export default Home;
