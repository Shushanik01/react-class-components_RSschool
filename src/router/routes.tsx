import { createBrowserRouter } from 'react-router';
import Layout from '../components/Layout/Layout';
import DetailsPannel from '../components/DetailsPannel/DetailsPannel';
import { ROUT_PATHS } from './routes-path';
import RouteError from './RouteError';
import About from '../components/AboutPage/About';

export const router = createBrowserRouter([
  {
    path: ROUT_PATHS.ROOT,
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        path: ROUT_PATHS.DETAILS,
        element: <DetailsPannel />,
      },
    ],
  },
  {
    path: ROUT_PATHS.ABOUT,
    element: <About />,
    errorElement: <RouteError />,
  },
]);
