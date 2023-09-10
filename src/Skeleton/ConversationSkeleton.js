import React from 'react'

function ConversationSkeleton() {
  return (
      <div className=' m-auto animate-pulse'>
      <div className='flex flex-col mt-2  h-20 bg-slate-300 '>
            <div className='flex space-x-3 items-center'>
            <div className='w-10 h-10 rounded-full mt-2 mb-2 mr-3 ml-3 bg-slate-400 border border-navbar'></div>
            <div className='text-slate-900 bg-slate-400 ml-2 w-24 h-4'></div>
      </div>
            <div className='pl-2 pr-2 text-[#2D3B58] bg-slate-400 h-6 ml-2 w-44 mb-2'></div>
      </div>

      <div className='flex flex-col mt-2 h-20 bg-slate-300 '>
            <div className='flex space-x-3 items-center'>
            <div className='w-10 h-10 rounded-full mt-2 mb-2 mr-3 ml-3 bg-slate-400 border border-navbar'></div>
            <div className='text-slate-900 bg-slate-400 ml-2 w-24 h-4'></div>
      </div>
            <div className='pl-2 pr-2 text-[#2D3B58] bg-slate-400 h-6 ml-2 w-44 mb-2'></div>
      </div>
      


      </div>
  )
}

export default ConversationSkeleton