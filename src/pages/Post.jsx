import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import parse from "html-react-parser";

function Post() {
  const { id } = useParams();
  const { UpdateToken, token } = useOutletContext();
  const [post, setPost] = useState();
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

  return <>{post && <div>{parse(post.text)}</div>}</>;
}

export default Post;
