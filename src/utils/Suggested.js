import React from 'react'
import { useNavigate } from 'react-router-dom';

function Suggested({name}) {
      const navigate = useNavigate();
      const redirect =(e)=>{
            e.preventDefault()
            navigate("/profile")
      }

  return (
    <div className='flex items-center w-fit my-4 border border-x-0 border-b-2 border-[#BED7F8] border-t-0'>
          <div className='mr-4 mb-2' >
                  <img src='/images/noProfile.jpeg' alt='image' className='w-10 h-10 rounded-full cursor-pointer border' onClick={redirect}/>
          </div>
          <div className='mr-14 lg:mr-24 xl:mr-40'>
                  <h1>{name}</h1>
          </div>  
    </div>
  )
}

export default Suggested