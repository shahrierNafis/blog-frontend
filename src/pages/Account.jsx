import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";

function Account() {
  const { api, fetcher } = useOutletContext();
  const [user, setUser] = useState();
  useEffect(() => {
    (async () => {
      const res = await fetcher(`${api}users/me`, { mode: "cors" });
      const user = await res.json();
      setUser(user);
    })();

    return () => {};
  }, [api, fetcher]);

  return (
    <>
      {user ? <h1>{user.username}</h1> : "loading..."}
      <LinkContainer to="/logout" className="w-fit	">
        <Button variant="secondary">Logout</Button>
      </LinkContainer>
    </>
  );
}

export default Account;