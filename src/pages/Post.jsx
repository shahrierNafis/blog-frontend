import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import parse from "html-react-parser";

import AddComments from "../components/AddComments";
import Comment from "../components/Comment";
function Post() {
  const { id } = useParams();
  const { UpdateToken, token } = useOutletContext();
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    (async () => {
      await UpdateToken();
      setPost(
        await (
          await fetch(`${import.meta.env.VITE_api}posts/${id}`, {
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })
        ).json()
      );
    })();

    return () => {};
  }, [UpdateToken, token, id]);
  useEffect(() => {
    if (post) {
      (async () => {
        await UpdateToken();
        setComments(
          await (
            await fetch(`${import.meta.env.VITE_api}posts/${id}/comments`, {
              mode: "cors",
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            })
          ).json()
        );
      })();
    }

    return () => {};
  }, [UpdateToken, token, id, post]);
  console.log(comments);
  return (
    <>
      {post && <div>{parse(post.text)}</div>}
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
