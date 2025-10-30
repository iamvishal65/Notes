import React from "react";
import Front from "./components/home/Front";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Newnotespage from "./components/notes/Newnotespage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Chooseregister from "./components/auth/Chooseregister";
import NoteDetail from "./components/home/NoteDetail";
import Logincheck from "./components/auth/Logincheck";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Logincheck />} />
        <Route path="/home" element={<Front />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/newnote" element={<Newnotespage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chooseRegister" element={<Chooseregister />} />
      </Routes>
    </Router>
  );
};

export default App;
