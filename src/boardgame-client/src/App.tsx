import './App.css'
import {Link, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import ConnectPage from "./connect/Connect.tsx";
import RegisterPage from "./connect/Register.tsx";
import GamePage from "./game/Game.tsx";
import {Provider} from "jotai";

function App() {

  return (
    <>
        <Provider>
            <Router>
                <nav className="top-nav">
                    <Link to="/">Reset</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<RegisterPage />} />
                    <Route path="/connect" element={<ConnectPage />} />
                    <Route path="/game" element={<GamePage />} />
                </Routes>
            </Router>
        </Provider>
    </>
  )
}

export default App
