import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const { UpdateToken, token } = useOutletContext();

  useEffect(() => {
    (async () => {
      // logout
      await UpdateToken();
      fetch(`${import.meta.env.VITE_api}logout`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
      // delete tokens
      delete token.accessToken;
      delete token.refreshToken;
      localStorage.removeItem("token");
      // redirect to login
      navigate("/login");
    })();
    return () => {};
  }, [UpdateToken, token, navigate]);

  return <div>Logout</div>;
}

export default Logout;
