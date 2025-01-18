import './App.css'
import {Link, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import ConnectPage from "./connect/Connect.tsx";
import RegisterPage from "./connect/Register.tsx";
import GamePage from "./game/Game.tsx";
import TableComponent from './game/Table.tsx';
import HandComponent from './game/Hand.tsx';
import {Provider} from "jotai";

function App() {

  return (
    <>
        <Provider>
            <Router>
                <nav className="top-nav">
                    <Link to="/">Back to start</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<RegisterPage />} />
                    <Route path="/connect" element={<ConnectPage />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/table" element={<TableComponent />} />
                    <Route path="/hand" element={<HandComponent />} />
                </Routes>
            </Router>
        </Provider>
    </>
  )
}

export default App
