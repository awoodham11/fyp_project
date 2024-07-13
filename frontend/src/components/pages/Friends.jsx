import React, { useEffect, useState } from 'react';
import api from '../../js/Api.js';
import FriendsMenu from '../FriendsMenu';
import axios from 'axios';

export const Friends = (props) => {
    const [highlightedPoem, setHighlightedPoem] = useState(-1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return(
        <div>
            <FriendsMenu/>
        </div>
    )


}