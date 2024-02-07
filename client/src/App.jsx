import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, About, SignIn, SignUp, Dashboard, Projects } from './pages';

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/About"} element={<About />} />
        <Route path={"/Sign-in"} element={<SignIn />} />
        <Route path={"/Sign-up"} element={<SignUp />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/projects"} element={<Projects />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
