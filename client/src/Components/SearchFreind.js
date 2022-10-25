import React from 'react'
import { Link ,useNavigate } from 'react-router-dom';

function SearchFreind({search,setSearch}) {

      const navigate =useNavigate()
  return (
      <div className='flex py-3 ml-2 items-center'>
      <Link to={"/profile/"+search._id}><img src={search.profile} className="rounded-full h-8 w-8 cursor-pointer" onClick={ () =>{
            setSearch([]);
            navigate("/profile/"+search._id)
      }}/></Link>
            <div className="ml-2">
                  <div className="name">{search.username}</div>
            </div>  
      </div>
  )
}

export default SearchFreind