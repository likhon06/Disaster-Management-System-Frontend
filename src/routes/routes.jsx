import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Donation from "../pages/Donation";
import Crisis from "../pages/Crisis";
import Volunteer from "../pages/Volunteer";
import Inventory from "../pages/Inventory";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import App from "../App";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/donation",
                element: <Donation />,
            },
            {
                path: "/crisis",
                element: <Crisis />,
            },
            {
                path: "/volunteer",
                element: <Volunteer />,
            },
            {
                path: "/inventory",
                element: <Inventory />,
            },
            {
                path: "/account",
                element: <Profile />,
            },
            {
                path: "/admin/*",
                element: <Admin />,
            },
        ]
    }

]);

export default router;
