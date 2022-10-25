import React from 'react'

function Skeleton() {
  return (
      <div className="animate-pulse h-[calc(100vh-7rem)] p-2  justify-evenly md:justify-center">
            <div className='grid grid-cols-3 gap-2'>
                  <div className='h-32  bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
                  <div className='h-32 bg-slate-100'></div>
            </div>
      </div>
  )
}

export default Skeleton