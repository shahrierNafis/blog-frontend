import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useOutletContext } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
/**
 * Render a form to create a new post.
 */
function CreatePost() {
  // Initialize state variables
  const [state, setState] = useState(true); // State variable for post state (published or draft)

  // Create a reference to the editor
  const editorRef = useRef(null);

  // Get the token and update token function from outlet context
  const { UpdateToken, token } = useOutletContext();

  // Get the navigate function from router
  const navigate = useNavigate();

  /**
   * Upload the post to the server.
   */
  const upload = async () => {
    try {
      // Check if the editor reference is defined
      if (editorRef.current) {
        // Get the content of the editor
        const text = editorRef.current.getContent();

        // Extract the title from the content
        const title = text.split("<h1>")[1].split("</h1>")[0];

        // Check if the title length is valid
        if (title.length < 3) {
          throw new Error("title must be at least 3 characters long");
        }

        // Update the token
        await UpdateToken();

        // Send a POST request to create the new post
        await fetch(`${import.meta.env.VITE_api}posts`, {
          method: "POST",
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

        // Navigate to the account page
        navigate("/account");
      }
    } catch (error) {
      // Handle any errors that occur during the upload process
      if (
        error.message == "Cannot read properties of undefined (reading 'split')"
      ) {
        error.message = "Please enter title with heading 1";
      }
      alert(error.message);
    }
  };

  // Render the form
  return (
    <>
      {/* Editor component */}
      <Editor
        apiKey="3l3qu55az0peo3ok54v32lrowhr8pzz6iwat9pp7bzojpqi5"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue=""
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
            "advcode",
          ],
          toolbar:
            " blocks | codesample | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />

      {/* Checkbox and label for post state */}
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

      {/* Upload button */}
      <Button onClick={upload}>Upload</Button>
    </>
  );
}

export default CreatePost;
