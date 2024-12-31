import React from "react";
import { Link, useNavigate } from "react-router-dom";

function SearchFreind({ search, setSearch }) {
  const navigate = useNavigate();
  return (
    <div className="flex py-3 ml-2 items-center">
      <Link to={"/profile/" + search._id}>
        <img
          src={search?.profile?.url}
          className="rounded-full h-6 w-6 cursor-pointer"
          alt="searchFreind"
          onClick={() => {
            setSearch([]);
            navigate("/profile/" + search._id);
          }}
        />
      </Link>
      <div className="ml-2">
        <div className="name">{search.username}</div>
      </div>
    </div>
  );
}

export default SearchFreind;
