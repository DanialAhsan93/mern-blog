import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, About, SignIn, SignUp, Dashboard, Projects } from './pages';
import Header from "./components/Header";


function App() {

  return (

    <BrowserRouter>
     <Header />
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
