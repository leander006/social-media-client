import React from 'react'

function MessageSkeleton() {
  return (
      <div className='animate-pulse'>
            <div className='flex '>
            <div className='flex flex-col mt-2 w-56 h-20 bg-slate-700 '>
                  <div className='flex space-x-3 items-center'>
                  <div className='w-10 h-10 rounded-full mt-2 mb-2 mr-3 ml-3 bg-slate-50 border border-navbar'></div>
                  <h1 className='text-[#2D3B58] w-12 bg-slate-200 h-4'></h1>
                  <h3 className='text-slate-900 bg-slate-200 ml-2 w-10 h-4'></h3>
            </div>
                  <div className='pl-2 pr-2 text-[#2D3B58] bg-slate-200 h-6 ml-2 w-36 mb-2'></div>
            </div>
            </div>

            <div className='flex justify-end'>
            <div className='flex flex-col mt-2 w-56 h-20 bg-slate-400 '>
                  <div className='flex space-x-3 items-center'>
                  <div className='w-10 h-10 rounded-full mt-2 mb-2 mr-3 ml-3 bg-slate-50 border border-navbar'></div>
                  <h1 className='text-[#2D3B58] w-12 bg-slate-200 h-4'></h1>
                  <h3 className='text-slate-900 bg-slate-200 ml-2 w-10 h-4'></h3>
            </div>
                  <div className='pl-2 pr-2 text-[#2D3B58] bg-slate-200 h-6 ml-2 w-36 mb-2'></div>
            </div>
            </div>  
    
            <div className='flex '>
            <div className='flex flex-col mt-2 w-56 h-20 bg-slate-700 '>
                  <div className='flex space-x-3 items-center'>
                  <div className='w-10 h-10 rounded-full mt-2 mb-2 mr-3 ml-3 bg-slate-50 border border-navbar'></div>
                  <h1 className='text-[#2D3B58] w-12 bg-slate-200 h-4'></h1>
                  <h3 className='text-slate-900 bg-slate-200 ml-2 w-10 h-4'></h3>
            </div>
                  <div className='pl-2 pr-2 text-[#2D3B58] bg-slate-200 h-6 ml-2 w-36 mb-2'></div>
            </div>
            </div>

            <div className='flex justify-end'>
            <div className='flex flex-col mt-2 w-56 h-20 bg-slate-400 '>
                  <div className='flex space-x-3 items-center'>
                  <div className='w-10 h-10 rounded-full mt-2 mb-2 mr-3 ml-3 bg-slate-50 border border-navbar'></div>
                  <h1 className='text-[#2D3B58] w-12 bg-slate-200 h-4'></h1>
                  <h3 className='text-slate-900 bg-slate-200 ml-2 w-10 h-4'></h3>
            </div>
                  <div className='pl-2 pr-2 text-[#2D3B58] bg-slate-200 h-6 ml-2 w-36 mb-2'></div>
            </div>
            </div>
            
    </div>
  )
}

export default MessageSkeleton