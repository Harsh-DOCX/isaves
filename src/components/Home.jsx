import LoggedHome from "./LoggedHome";
import LoggedOutHome from "./LoggedOutHome";

const Home = ({ isLoggedIn }) => {
    return (
        <div className="home-container">
            {isLoggedIn ? <LoggedHome /> : <LoggedOutHome />}
        </div>
    );
};

export default Home;