import './style.css'
import Navbar from "./components/Navbar";
import Home from './components/Home';
import Addpassword from './components/Addpassword';
import Login from './components/Login';
import Signup from './components/Signup';
import Forgot from './components/Forgot';
import Change from './components/Change';
import Showpassword from './components/Showpassword';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <>
      <Router basename="/isaves">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add-password' element={<Addpassword />} />
          <Route path='/login' element={<Login />} />
          <Route path='/sign-up' element={<Signup />} />
          <Route path='/forget-password' element={<Forgot />} />
          <Route path='/change-credentials' element={<Change />} />
          <Route path='/show-passwords' element={<Showpassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
