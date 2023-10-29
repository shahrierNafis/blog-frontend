import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useOutletContext } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
function CreatePost() {
  const [state, setState] = useState(true);
  const editorRef = useRef(null);
  const { UpdateToken, token } = useOutletContext();
  const navigate = useNavigate();
  const upload = async () => {
    try {
      if (editorRef.current) {
        const text = editorRef.current.getContent();
        const title = text.split("<h1>")[1].split("</h1>")[0];
        if (title.length < 3) {
          throw new Error("title must at least 3 characters long");
        }
        await UpdateToken();
        fetch(`${import.meta.env.VITE_api}posts`, {
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
        navigate("/account");
      }
    } catch (error) {
      if (
        error.message == "Cannot read properties of undefined (reading 'split')"
      ) {
        error.message = "Please enter title with heading 1 ";
      }
      alert(error.message);
    }
  };
  return (
    <>
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

export default CreatePost;
