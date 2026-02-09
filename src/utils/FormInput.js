function FormInput({
    name,
    onChange,
    required = false
}) {
    return (
        <div>
            <label className="mb-2">{name}</label>
            <input
                className="w-full mb-3 h-12 rounded-md p-3 md:mb-8  border border-black"
                onChange={onChange}
                type="text"
                required={required}
            />
        </div>
    )
}

export default FormInput