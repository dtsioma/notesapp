import React, { useContext } from "react";
import { Routes } from "./components/general/Routes";
import { Header } from "./components/header/Header";
import "./App.css";

const authData = {
  isAuthenticated: true,
};

export const AuthContext = React.createContext(authData);

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes />
    </div>
  );
};

export default App;
