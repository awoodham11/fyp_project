import './css/App.css';
import Sidebar from './components/pages/Sidebar';
import { Newsfeed } from './components/pages/NewsFeed';
import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
})


function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }


  return (
    <div className="App">
      <Newsfeed/>
      <div id='outer-container'>
        <div id='sidebar'>
          <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'}/>
        </div>
      </div>
    </div>
  );
}

export default App;
