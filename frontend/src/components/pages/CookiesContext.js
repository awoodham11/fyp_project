import React, { createContext, useContext } from 'react';
import Cookies from 'universal-cookie';

const CookiesContext = createContext();

export const CookiesProvider = ({ children }) => {
  const cookies = new Cookies();

  return (
    <CookiesContext.Provider value={cookies}>
      {children}
    </CookiesContext.Provider>
  );
};

export const useCookies = () => useContext(CookiesContext);
