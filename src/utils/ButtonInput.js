
function ButtonInput({ value, onClick }) {
    return (
        <button onClick={onClick} className="bg-[#BED7F8] mb-2 w-full  md:w-1/2 h-10  hover:bg-[#afd1fd]">
            {value}
        </button>
    )
}

export default ButtonInput