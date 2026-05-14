import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout/Layout";
import DetailsPannel from "../components/DetailsPannel/DetailsPannel";
import { ROUT_PATHS } from "./routes-path";

export const router = createBrowserRouter([{
    path: ROUT_PATHS.ROOT,
    element: <Layout/>,
    children: [
        {
            path: ROUT_PATHS.DETAILS,
            element: <DetailsPannel/>
        }
    ],

}]);