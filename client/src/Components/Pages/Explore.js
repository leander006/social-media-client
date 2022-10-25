import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { postError, postStart, postSuccess } from '../../redux/Slice/postSlice'
import {axiosInstance} from '../../Config'
import Cookie from "js-cookie"
import Pin from '../GridSystem/Pin'
import Skeleton from '../Skeleton/Skeleton'
import SearchFreind from '../SearchFreind'
import { Link } from 'react-router-dom'

const sizeArray = ["sm", "md", "lg"];

function Explore() {
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState([]);

  const dispatch = useDispatch()
  const config ={
    headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${Cookie.get('token')}`
    }
  }
  const {allpost,loading} = useSelector(state =>state.post)

  const handleSearch = async(query)=>{
    setSearch(query)
    if(!query){
      return
    }
    try {
        const {data} = await axiosInstance.get("/user/oneUser?name="+search,config)
        setSearched(data)

    } catch (error) {
        console.log(error);      
    }
}

useEffect(() => {
  const getAllPost = async() =>{
    try {
      dispatch(postStart())
      const {data} = await axiosInstance.get("/post",config)
      dispatch(postSuccess(data))
    } catch (error) {
      dispatch(postError())
         console.log(error?.response?.data);
    }
  }
  getAllPost()
  
},[] )
 

  return (
    <>
    <Navbar/>
      <div className='flex bg-[#2D3B58] z-50 pt-9'>
        <div className='flex flex-col mb-4'>
         <div className='flex md:hidden ml-5 mt-2 w-[90vw] items-center bg-slate-200 rounded-md'>
                <input className='rounded-md w-full m-2 p-1' type="text" placeholder='search your friends' value={search} onChange={e =>handleSearch(e.target.value)}/>
          </div>
          <div className="flex lg:hidden fixed z-30 ml-6 mt-12 bg-[#a1bcf1] ">
                              <div className="w-96 ">
                              {searched?.map((s) =>(
                                    <SearchFreind key={s._id} search={s}/>
                              ))}
                            
                              </div>
          </div>

          {!loading? <div className='hidden w-screen bg-[#2D3B58] md:h-[calc(100vh-2.25rem)] overflow-y-scroll justify-center md:absolute md:grid auto-rows-2fr grid-cols-8'>
                {allpost?.map((p) =>(
                    <Pin display={false} url={p.content} id={p._id} key={p._id} size={sizeArray[Math.floor(Math.random() * 3)]}  />
                  )
                )}
          </div >:<div className='hidden w-screen bg-[#2D3B58] md:h-[calc(100vh-2.25rem)] overflow-y-scroll justify-center md:absolute md:grid auto-rows-2fr grid-cols-8'>
                {allpost?.map((p) =>(
                    <Pin display={true} url={p.content} id={p._id} key={p._id} size={sizeArray[Math.floor(Math.random() * 3)]}  />
                  )
                )}
          </div >}

          {!loading? <div className='w-screen md:hidden bg-[#2D3B58] h-[calc(100vh-6.75rem)] overflow-y-scroll p-2 grid grid-rows-3 grid-flow-col gap-4'>
          <div className="grid grid-cols-3 gap-2">
            {allpost.map((p) =>(
                <Link key={p._id} to={"/singlepage/"+p._id}><img className='transform transition duration-500 hover:scale-110 h-36 cursor-pointer' src={p?.content}/></Link>
              ))}
         </div>
          </div >:<Skeleton/>}
        </div>

      </div>
    </>
    
  )
}

export default Explore











{/* <div className=' break-inside-avoid'>
                  <img src='image1.jpeg'></img>
            </div>
            <div className=' break-inside-avoid'>
                  <img src='image2.jpeg'></img>
            </div>
            <div className='break-inside-avoid'>
                  <img src='image3.jpeg'></img>
            </div>
            <div className=' break-inside-avoid'>
                  <img src='images4.jpeg'></img>
            </div>
            <div className='break-inside-avoid'>
                  <img src='images5.jpeg'></img>
            </div>
            <div className='break-inside-avoid'>
                  <img src='images6.jpeg'></img>
            </div>
            <div className=' break-inside-avoid'>
                  <img src='images7.jpeg'></img>
            </div>
            <div className=' break-inside-avoid'>
                  <img src='images8.jpeg'></img>
            </div>
            <div className=' break-inside-avoid'>
                  <img src='images9.jpeg'></img>
            </div> */}

            // <div className=' break-inside-avoid'>
            //       <img src='images4.jpeg'></img>
            // </div>
            // <div className='break-inside-avoid'>
            //       <img src='images5.jpeg'></img>
            // </div>
            // <div className='break-inside-avoid'>
            //       <img src='images6.jpeg'></img>
            // </div>
            // <div className=' break-inside-avoid'>
            //       <img src='images7.jpeg'></img>
            // </div>

            // <div className=' break-inside-avoid'>
            //       <img src='image1.jpeg'></img>
            // </div>
            // <div className=' break-inside-avoid'>
            //       <img src='image2.jpeg'></img>
            // </div>
            // <div className='break-inside-avoid'>
            //       <img src='image3.jpeg'></img>
            // </div>


//             <div className=' break-inside-avoid'>
//                   <img src='images8.jpeg'></img>
//             </div>
//             <div className=' break-inside-avoid'>
//                   <img src='images9.jpeg'></img>
//             </div>
{/* <div className='rows-3  md:columns-4 lg:columns-5 xl:columns-7 h-[calc(100vh-6rem)] md:h-[calc(100vh-4.5rem)] overflow-y-scroll mx-auto space-y-3 bg-white p-4 w-screen gap-3 md:w-11/12  md:mt-4 my-3'> */}

//             <div className=' break-inside-avoid'>
//                   <img src='images4.jpeg'></img>
//             </div>
