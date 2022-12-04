import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [ theme, setTheme ] = useState();
    
    useEffect(() => {
        const updateTheme = () => {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(isDark ? "dark-mode" : "light-mode");
        };
        updateTheme();
        
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', updateTheme);
    }, [ setTheme ]);
    
    const contextPayload = useMemo(
        () => ({ theme, setTheme }), [ theme, setTheme ]
    );
    
    return pug`
        ThemeContext.Provider(value=contextPayload)
            | ${children}
    `;
};

export const useTheme = () => useContext(ThemeContext);