import React from 'react'

function ListItems({user,handleFunction}) {
  return (
    <div className='flex items-center ml-1 mb-1 rounded p-0.5 bg-[#02377c]'>
          <div className=''>
                <h1 className='text-white '>{user.username}</h1>
          </div>
          <i className="fa-solid fa-xl ml-2 text-white fa-xmark" onClick={handleFunction}></i>
    </div>
  )
}

export default ListItems