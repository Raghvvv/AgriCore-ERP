import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createBrowserRouter,RouterProvider} from 'react-router';
import Layout from "./Layout.jsx";
import Login2 from "./components/Login2.jsx"
import CssBaseline from '@mui/material/CssBaseline'
import {ThemeProvider} from "@mui/material/styles"
import {createTheme} from "@mui/material/styles"
import { green, amber } from "@mui/material/colors";

import ProtectedRoutes from "./Utils/ProtectedRoutes.jsx";
import InventoryTable from "./components/tables/InventoryTable.jsx";

import CropsTable from './components/tables/CropsTable.jsx';
import LivestockTable from './components/tables/LivestockTable.jsx';
import FinanceTable from './components/tables/FinanceTable.jsx';

// Placeholder for a Dashboard component
const Dashboard = () => <div>Welcome to AgriCore Dashboard!</div>;

const router=createBrowserRouter([
    {
        path:'/login', 
        element:<Login2/>
    },
    {
        path:'/',
        element:<ProtectedRoutes><Layout/></ProtectedRoutes>, // Protect the entire layout
        children:[
            {
                index: true, // This route renders when the parent path (/) is matched exactly
                element: <Dashboard/>
            },
            {
                path:"inventory",
                element:<InventoryTable/>
            },
            {
                 path:"crops",
                 element:<CropsTable/>
             },
             {
                 path:"livestock",
                 element:<LivestockTable/>
             },
             {
                 path:"finance",
                 element:<FinanceTable/>
             }
       ]
    }
]);

const theme=createTheme({
    palette: {
        primary: {
            main: green[500],
        },
        secondary: {
            main: amber[500],
        },
    },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ThemeProvider theme={theme}>
        <CssBaseline/>
        <RouterProvider router={router}/>
     </ThemeProvider>
  </StrictMode>,
);
