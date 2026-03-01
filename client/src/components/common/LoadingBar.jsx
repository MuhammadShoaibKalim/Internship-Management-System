import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingBar = () => {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        // Start showing loader on route change
        setVisible(true);
        setProgress(30);

        const timer1 = setTimeout(() => setProgress(60), 200);
        const timer2 = setTimeout(() => setProgress(90), 400);
        const timer3 = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);
        }, 600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [pathname]);

    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 w-full z-[100] h-1 pointer-events-none">
            <div
                className="h-full bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default LoadingBar;
