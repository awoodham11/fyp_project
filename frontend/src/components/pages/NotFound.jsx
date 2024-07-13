import React from "react";
import { Link } from "react-router-dom";


class NotFoundPage extends React.Component {
    render(){

        import('../../css/NotFoundPage.css');
        
        return (
            <div className='notfound-page'>
                <p className='msg-404'>
                    Sorry! That page either could not be found, or does not exist. (Error 404)
                    <br />
                    <Link to={"/"}> Go Back to the Home Page</Link>
                </p>
            </div>
        )
    }
}

export default NotFoundPage;