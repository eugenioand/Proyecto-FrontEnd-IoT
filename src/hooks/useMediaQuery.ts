import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const updateMatches = (e: MediaQueryListEvent) => setMatches(e.matches);

        // Set the initial value
        setMatches(mediaQueryList.matches);

        // Add listener to update the state on screen size change
        mediaQueryList.addEventListener('change', updateMatches);

        // Clean up listener on component unmount
        return () => {
            mediaQueryList.removeEventListener('change', updateMatches);
        };
    }, [query]);

    return matches;
};

export default useMediaQuery;
