const Button =({ children, onClick, style, className, type}) => {
    return (
        <button
        onClick={onClick}
        style={style}
        className= {className}
        type={type}
        >
        {children}
        </button>
    )
}

export default Button;