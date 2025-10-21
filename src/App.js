import './App.scss';
import {Route, Routes} from 'react-router-dom';
import Layout from "./Layout/Layout";
import Home from "./home/home";
import ItSpashel from "./it_spashel/it_spashel";
import SingIn from "./sing_in/sing_in";

function App() {
    return (
        <>
            <Routes>
                <Route path="sing_in" element={<SingIn/>}/>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="it" element={<ItSpashel/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;
