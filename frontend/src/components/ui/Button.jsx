const Button = ({ variant = "primary", children, icon, ...props }) => {
    const isGoogle = variant === "google";
    const className = isGoogle ? "google-btn" : "primary-btn";

    return (
        <button className={className} {...props}>
            {icon && icon}
            {children}
        </button>
    );
};

export default Button;