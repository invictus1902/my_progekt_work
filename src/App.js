import './App.scss';
import {Route, Routes} from 'react-router-dom';
import Layout from "./Layout/Layout";
import Home from "./home/home";
import SingIn from "./all_pages/sing_in/sing_in";
import Admin from "./all_pages/admin/admin";
import Sotrudnik from "./all_pages/sotrednik/sotrudnik";
import Catalog from "./all_pages/catalog_mebeli/catalog";
import EditMebel from "./all_pages/edit_mebel/edit_mebel";
import PlacingAnOrder from "./all_pages/placing_an_order/placing_an_order";
import OrderEditor from "./all_pages/order_editor/order_editor";
import View_orders from "./all_pages/view_orders/view_orders";
import Order from "./all_pages/order/order";

function App() {
    return (
        <>
            <Routes>
                <Route index element={<SingIn />} />
                <Route path="/" element={<Layout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="sotrudnik" element={<Sotrudnik />} />
                    <Route path="catalog" element={<Catalog />} />
                    <Route path="/edit_mebel" element={<EditMebel />} />
                    <Route path="/placing_an_order" element={<PlacingAnOrder />} />
                    <Route path="/order_editor" element={<OrderEditor />} /> {/* Если это другая страница */}
                    <Route path="/view_orders" element={<View_orders />} />
                    <Route path="/order/:id" element={<Order />} /> {/* ← ИЗМЕНЕНО: с :id */}
                </Route>
            </Routes>
        </>
    );
}

export default App;
