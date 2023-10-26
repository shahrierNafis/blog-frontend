import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const { api, fetcher, token } = useOutletContext();

  useEffect(() => {
    delete token.accessToken;
    delete token.refreshToken;
    localStorage.removeItem("token");
    fetcher(`${api}logout`, {
      method: "DELETE",
      mode: "cors",
    });
    navigate("/login");
    return () => {};
  });

  return <div>Logout</div>;
}

export default Logout;
