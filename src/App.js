import './App.scss';
import {Route, Routes} from 'react-router-dom';
import Layout from "./Layout/Layout";
import Home from "./home/home";
import ItSpashel from "./it_spashel/it_spashel";
import SingIn from "./sing_in/sing_in";
import Admin from "./all_pages/admin/admin";
import Sotrudnik from "./all_pages/sotrednik/sotrudnik";
import Catalog from "./catalog_mebeli/catalog";

function App() {
    return (
        <>
            <Routes>
                <Route index element={<SingIn/>}/>
                <Route path="/" element={<Layout/>}>
                    <Route path="home" element={<Home/>}/>
                    <Route path="it" element={<ItSpashel/>}/>
                    <Route path='admin' element={<Admin/>}/>
                    <Route path='sotrudnik' element={<Sotrudnik/>}/>
                    <Route path='it_spashel' element={<ItSpashel/>}/>
                    <Route path='catalog' element={<Catalog/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;
