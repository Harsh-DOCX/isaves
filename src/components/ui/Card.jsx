const Card = ({ title, children }) => {
    return (
        <div className="futuristic-container">
            <div className="auth-card">
                {title && <h2 className="auth-title">{title}</h2>}
                {children}
            </div>
        </div>
    );
};
export default Card;