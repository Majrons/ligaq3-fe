import { useState, useEffect } from 'react';

export const useIsMobileView = (): boolean => {
    const [isMobileView, setIsMobileView] = useState<boolean>(false);

    useEffect(() => {
        const checkIsMobile = () => {
            const isMobileWidth = window.innerWidth <= 768;

            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileAgent = /iphone|ipod|android|blackberry|windows phone|iemobile|mobile/i.test(userAgent);

            setIsMobileView(isMobileWidth || isMobileAgent);
        };

        checkIsMobile();

        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    return isMobileView;
};
