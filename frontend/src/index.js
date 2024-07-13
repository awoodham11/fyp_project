import React from 'react';
import ReactDOM from 'react-dom/client';
//import './css/index.css';
import App, { loader as appLoader, standardLoader, loginLoader} from './js/Loaders';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Base } from './components/Base';
import { ErrorPage } from './components/ErrorPage';
import { ProfileFriend } from './components/pages/ProfileFriend'
import { Login } from './components/pages/Login';
import { Search } from './components/pages/Search';
import { Message } from './components/pages/Message';
import { MessageDetail } from './components/pages/MessageDetail';
import { UserProfile } from './components/pages/UserProfile';
import { SearchUsers } from './components/pages/SearchUsers';
import { Register } from './components/pages/Register';
import { Title } from './components/Title';
import { Newsfeed } from './components/pages/Newsfeed';
import { EditProfile } from './components/pages/EditProfile';
import { JobBoard } from './components/pages/JobBoard';
import { Friends } from './components/pages/Friends';
import { PostJob } from './components/pages/PostJob';
import { StatusPost } from './components/pages/StatusPost';
import SearchOnMap, { MapPage } from './components/pages/MapPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader,
  },
  {
    path: "newsfeed",
    element: <Base component={ <Newsfeed/>}></Base>,
    errorElement: <Base component={ <ErrorPage /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "profile",
    element: <Base component={ <UserProfile/>}></Base>,
    errorElement: <Base component={ <ErrorPage /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "search",
    element: <Base component={ <Search/>}></Base>,
    errorElement: <Base component={ <ErrorPage /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "edit-profile",
    element: <Base component={ <EditProfile/>}></Base>,
    errorElement: <Base component={ <ErrorPage /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "login",
    element: <Title component={ <Login/>}></Title>,
    errorElement: <Title component={ <ErrorPage /> }></Title>,
    loader: loginLoader,
  },
  {
    path: "register",
    element: <Title component={ <Register/>}></Title>,
    errorElement: <Title component={ <ErrorPage /> }></Title>,
    loader: loginLoader,
  },
  {
    path: "/user/:userId",
    element: <Base component={ <ProfileFriend /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "/inbox",
    element: <Base component={ <Message /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "/inbox/:id",
    element: <Base component={ <MessageDetail /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "/search-chat/:username",
    element: <Base component={ <SearchUsers /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "/job-board",
    element: <Base component={ <JobBoard /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "/post-job",
    element: <Base component={ <PostJob /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "/status-post",
    element: <Base component={ <StatusPost /> }></Base>,
    loader: standardLoader,
  },
  {
    path: "/map",
    element: <Base component={ <SearchOnMap />}></Base>,
    loader: standardLoader,
  },
  {
    path: "friends",
    element: <Base component={ <Friends /> }></Base>,
    errorElement: <Base component={ <ErrorPage /> }></Base>,
    loader: standardLoader,
  },


])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>
);


reportWebVitals();
