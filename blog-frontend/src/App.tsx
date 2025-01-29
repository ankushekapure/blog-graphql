import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Route, Routes } from "react-router-dom";
import Blogs from "./components/Blogs/Blogs";
import Auth from "./components/Auth/Auth";

function App() {

  return (
    <>
      <header>
        <Header />
      </header>
   <main>
    <Routes>
      <Route element={<HomePage/>} path="/" />
      <Route element={<Blogs/>} path="/blogs" />
      <Route element={<Auth/>} path="/auth" />
    </Routes>
   </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;
