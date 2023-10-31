import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import parse from "html-react-parser";

/**
 * Fetches posts from the API and renders them as links.
 * @returns {JSX.Element} The rendered component.
 */
function Home() {
  // Declare a state variable to store the fetched posts
  const [posts, setPosts] = React.useState([]);

  // Fetch posts from the API when the component mounts
  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_api}posts`, { mode: "cors" })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Cleanup function
    return () => {};
  }, []);

  // Render the posts as links if there are any, otherwise render "loading..."
  return (
    <>
      {posts && posts.length > 0
        ? posts.map((post) => (
            <LinkContainer key={post._id} to={`/post/${post._id}`}>
              <h1 className="hover:text-sky-500 text-5xl">
                <span>{"->"}</span> {parse(post.title)}
              </h1>
            </LinkContainer>
          ))
        : "loading..."}
    </>
  );
}

export default Home;
