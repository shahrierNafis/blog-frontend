import React from "react";
import PropTypes from "prop-types";

function PostPage({ post }) {
  return <div>{Object.keys(post)}</div>;
}
PostPage.propTypes = {
  post: PropTypes.object,
};
export default PostPage;
