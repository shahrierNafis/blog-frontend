import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useOutletContext, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
function Edit() {
  const { id } = useParams();
  const [state, setState] = useState(true);
  const editorRef = useRef(null);
  const { UpdateToken, token } = useOutletContext();
  const navigate = useNavigate();
  const [post, setPost] = useState();
  /**
   * Uploads content to the server.
   *
   * @throws {Error} If the title is less than 3 characters long or if there is an error during the upload process.
   */
  const upload = async () => {
    try {
      if (editorRef.current) {
        const text = editorRef.current.getContent();
        const title = text.split("<h1>")[1].split("</h1>")[0];

        // Check if the title is at least 3 characters long
        if (title.length < 3) {
          throw new Error("title must be at least 3 characters long");
        }

        await UpdateToken();

        // Make the API request to update the post
        const response = await fetch(`${import.meta.env.VITE_api}posts/${id}`, {
          method: "PUT",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            text,
            state: state ? "published" : "draft",
          }),
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to update post");
        }

        // Redirect to the account page
        navigate("/account");
      }
    } catch (error) {
      if (
        error.message == "Cannot read properties of undefined (reading 'split')"
      ) {
        error.message = "Please enter a title with a heading 1";
      }

      // Display the error message
      alert(error.message);
    }
  };
  useEffect(() => {
    (async () => {
      await UpdateToken();
      const response = await fetch(`${import.meta.env.VITE_api}posts/${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
      console.log(response);
      const data = await response.json();
      setPost(data);
    })();
    return () => {};
  }, [id, token, UpdateToken]);
  console.log(post);
  return (
    <>
      <Editor
        apiKey="3l3qu55az0peo3ok54v32lrowhr8pzz6iwat9pp7bzojpqi5"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={post ? post.text : ""}
        init={{
          skin: "oxide-dark",
          content_css: "dark",
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "codesample",
          ],
          toolbar:
            " blocks | codesample |" +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <label htmlFor="state">
        <input
          value={state}
          name="state"
          type="checkbox"
          onChange={() => {
            setState(!state);
          }}
          checked={state}
        />{" "}
        :Publish
      </label>

      <Button onClick={upload}>Upload</Button>
    </>
  );
}

export default Edit;
