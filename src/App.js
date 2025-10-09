import './App.scss';
import {Route, Routes} from 'react-router-dom';
import Layout from "./Layout/Layout";
import Home from "./home/home";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;
