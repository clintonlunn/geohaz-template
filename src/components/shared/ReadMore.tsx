import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../@/components/ui/button';

const ReadMore = ({ children }: { children: React.ReactNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [maxHeight, setMaxHeight] = useState('255px');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateMaxHeight = () => {
            if (contentRef.current) {
                if (isExpanded) {
                    // Temporarily set maxHeight to 'none' to get the full scrollHeight
                    contentRef.current.style.maxHeight = 'none';
                    const updatedMaxHeight = contentRef.current.scrollHeight + 'px';
                    // Set the maxHeight to the new value
                    setMaxHeight(updatedMaxHeight);
                } else {
                    setMaxHeight('255px');
                }
            }
        };
        updateMaxHeight();
    }, [isExpanded]);

    useEffect(() => {
        const handleResize = () => {
            if (isExpanded && contentRef.current) {
                setMaxHeight(`${contentRef.current.scrollHeight}px`);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isExpanded]);

    return (
        <div className="overflow-hidden">
            <div
                ref={contentRef}
                className="transition-[max-height] duration-200 ease-in-out overflow-hidden"
                style={{ maxHeight, boxSizing: 'border-box' }}
            >
                {children}
            </div>
            <div className="flex justify-center mt-4">
                <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)} className="w-full border-2 border-secondary">
                    <span>{isExpanded ? 'Read less' : 'Read more'}</span>
                </Button>
            </div>
        </div>
    );
};

export { ReadMore };
