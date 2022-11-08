import React from 'react'

function SingleSkeleton() {
  return (
      <div className='flex animate-pulse flex-col p-4 lg:items-center lg:justify-center lg:p-4 lg:flex-row h-[calc(100vh-4.3rem)] w-screen lg:h-[calc(100vh-2.7rem)] overflow-y-scroll'>
      <div className='h-1/4  lg:h-5/6 lg:border border-[#BED7F8]  lg:w-2/5'>
            <div className=' w-full h-full bg-slate-50'></div>
      </div>
      <div className='flex flex-col lg:border border-[#BED7F8] p-2 h-3/4 lg:h-5/6  lg:w-2/5  '>
          <div className='flex p-1 ' >
                  <div className='w-10 h-10 bg-slate-50 rounded-full  border'></div>
                  <div className='main '>
                  <div className='capitalize ml-2 font-sans  font-bold bg-white' ></div>
                  <div className='ml-2 text-sm mt-3 bg-slate-300 '></div>
                  </div>
          </div>
          <div className='border-x-0 border-t-2 border-[#BED7F8] lg:h-3/4 border-b-0 overflow-y-scroll'>
          </div>
          <div className='flex my-3 mx-3 text-white  items-center justify-between' >
        <div className='flex items-center' >
              <div className='flex likes flex-col justify-center mt-3'>
                  <i className="fa-regular fa-heart fa-2xl pr-3"/>
              </div>
                <div>
                      <i className="fa-regular fa-2xl fa-comment " ></i>
                      <div></div>
                </div>
                
        </div>
         <div className='cursor-pointer'>
                <i className="fa-regular fa-xl fa-bookmark" ></i>
        </div>             
        
  </div>
          <div className='flex items-center bg-[#455175] rounded-md'>
                <input className='w-full rounded-md p-1'  type="text"></input>
          </div>
    </div>
  </div>
  )
}

export default SingleSkeleton