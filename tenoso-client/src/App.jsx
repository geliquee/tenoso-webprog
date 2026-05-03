import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Layout from './layouts/Layout';
import ArticlePage from './pages/LandingPages/ArticlePage';
import HomePage from './pages/LandingPages/HomePage';
import AboutPage from './pages/LandingPages/AboutPage';
import ArticleListPage from './pages/LandingPages/ArticleListPage';

import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

import NotFoundPage from './pages/NotFoundPage';

import login from './assets/images/login.png';  
import signup from './assets/images/signup.png';  

import DashLayout from "./layouts/DashLayout.jsx";
import DashboardPage from "./pages/DashboardPages/DashboardPage.jsx";
import ReportsPage from "./pages/DashboardPages/ReportsPage.jsx";
import UsersPage from "./pages/DashboardPages/UsersPage.jsx";

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'articles', element: <ArticleListPage /> },
      { path: 'articles/:name', element: <ArticlePage /> },
    ],
  },
  {
    path: 'auth/signin',
    element: <AuthLayout image={login} />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <SignInPage /> },
    ],
  },
  {
    path: 'auth/signup',
    element: <AuthLayout image={signup} />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <SignUpPage /> },
    ],
  },
    {
    path: "dashboard",
    element: <DashLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "users",
        element: <UsersPage/>
      }
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;