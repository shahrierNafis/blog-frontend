import React from "react";

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
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </>
  );
}

export default Home;
