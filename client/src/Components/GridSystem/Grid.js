import React from 'react'
import { Link } from 'react-router-dom';

const styles = {
      sm: {
        gridRow: "span 3 / span 3",
      },
      md: {
        gridColumn: "span 2 / span 2",
      },
      lg: {
        gridRow: "span 2 / span 2",
      },
    };

function Grid({url,id,size}) {
  return (
      <div className="transform transition duration-500 hover:scale-110" style={{ ...styles[size], cursor: "pointer" }}>
            <Link to={"/singlepage/"+id}><img className='h-full w-fit rounded-lg object-cover' src={url} alt="img"/></Link>

      </div>
  )
}

export default Grid