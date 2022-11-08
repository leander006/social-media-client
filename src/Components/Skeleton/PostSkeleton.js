import React from 'react'
import SearchFreindSkeleton from './SearchFreindSkeleton'

function PostSkeleton() {
  return (
    <div className='flex w-screen'>
      <div className='flex animate-pulse flex-col lg:basis-[70%] w-screen shadow lg:w-[55%] xl:w-[35%] bg-[#455175] md:mt-4 my-3'>
      <div className='main lg:pl-24' >
      <div className='flex p-1 items-center' >
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
           <div className="h-2 bg-slate-200 rounded"></div>
      </div>
      <div className='flex justify-center'>
      <div className= 'w-full h-56 bg-slate-50 lg:w-[100vw]'></div>
      </div>
      <div className='flex my-3 mx-3 items-center justify-between' >
            <div className='flex likes cursor-pointer items-center'>
                          <i className="fa-solid text-slate-50 fa-heart fa-2xl pr-3"/>
                          <i className="fa-solid text-slate-50 fa-2xl fa-comment" ></i>                        
            </div>
             <div>
                    <i className="fa-solid fa-xl text-slate-50 fa-bookmark "></i>
            </div>             
            
      </div>
   </div>
   <div className='main pt-2 lg:pl-24' >
      <div className='flex p-1 items-center' >
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
           <div className="h-2 bg-slate-200 rounded"></div>
      </div>
      <div className='flex justify-center'>
      <div className= 'w-full h-56 bg-slate-50 lg:w-[100vw]'></div>
      </div>
      <div className='flex my-3 mx-3 items-center justify-between' >
            <div className='flex likes cursor-pointer items-center'>
                          <i className="fa-solid text-slate-50 fa-heart fa-2xl pr-3"/>
                          <i className="fa-solid text-slate-50 fa-2xl fa-comment" ></i>                        
            </div>
             <div>
                    <i className="fa-solid fa-xl text-slate-50 fa-bookmark "></i>
            </div>             
            
      </div>
   </div>

   <div className='main pt-2 lg:pl-24' >
      <div className='flex p-1 items-center' >
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
           <div className="h-2 bg-slate-200 rounded"></div>
      </div>
      <div className='flex justify-center'>
      <div className= 'w-full h-56 bg-slate-50 lg:w-[100vw]'></div>
      </div>
      <div className='flex my-3 mx-3 items-center justify-between' >
            <div className='flex likes cursor-pointer items-center'>
                          <i className="fa-solid text-slate-50 fa-heart fa-2xl pr-3"/>
                          <i className="fa-solid text-slate-50 fa-2xl fa-comment" ></i>                        
            </div>
             <div>
                    <i className="fa-solid fa-xl text-slate-50 fa-bookmark "></i>
            </div>             
            
      </div>
   </div>
</div>
   
   <div className='hidden lg:flex basis-[30%] lg:mr-[10rem] lg:ml-[2rem] md:w-60 h-[calc(100vh-3.5rem)] overflow-y-scroll lg:w-80 xl:w-96 ml-2 flex-col  mt-3 text-white '>
              <SearchFreindSkeleton/>
        </div>
</div>
  )
}

export default PostSkeleton