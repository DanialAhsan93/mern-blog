import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import Header from './components/Header';
import FooterComp from './components/Footer';

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/projects' element={<Projects />} />
        </Routes>
        <FooterComp />
      </BrowserRouter>
    </>
  )
}

export default App
