import api from './Api';
import Cookies from 'universal-cookie';
import { redirect } from 'react-router-dom';

export async function loader() {

    const cookies = new Cookies();
  
    // If the user isn't logged in, redirect to the login page
    if (cookies.get("Token") == null) return redirect("/login");
  
    // Redirect to home page
    return redirect("/login");
  }
  
  export async function standardLoader() {
  
    const cookies = new Cookies();
  
    // If the user isn't logged in, redirect to the login page
    if (cookies.get("Token") == null) return redirect("/login");
  
    return null;
  }

  export async function loginLoader() {

    const cookies = new Cookies();
  
    // If the user is logged in, redirect to the news feed
    if (cookies.get("Token") != null) return redirect("/newsfeed");
  
    return null;
  }
  
  export default standardLoader;
