const Input = ({ label, id, ...props }) => {
    return (
        <div className="input-group">
            {label && <label htmlFor={id}>{label}</label>}
            <input id={id} className="futuristic-input" {...props} />
        </div>
    );
};
export default Input;