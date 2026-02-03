import { useCallback, useRef, useState } from 'react';

interface UseLongPressOptions {
    threshold?: number;
    onStart?: (e: any) => void;
    onCancel?: (e: any) => void;
}

export const useLongPress = (
    onLongPress: (e: any) => void,
    onClick?: (e: any) => void,
    { threshold = 500, onStart, onCancel }: UseLongPressOptions = {}
) => {
    const [isLongPressActive, setIsLongPressActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>();
    const isCanceled = useRef(false);

    const start = useCallback(
        (e: any) => {
            isCanceled.current = false;
            if (onStart) onStart(e);

            timerRef.current = setTimeout(() => {
                if (!isCanceled.current) {
                    setIsLongPressActive(true);
                    onLongPress(e);
                }
            }, threshold);
        },
        [onLongPress, threshold, onStart]
    );

    const cancel = useCallback(
        (e: any) => {
            isCanceled.current = true;
            if (timerRef.current) clearTimeout(timerRef.current);
            if (isLongPressActive) {
                setIsLongPressActive(false);
            } else if (onClick && !isCanceled.current) {
                // This logic is a bit tricky for nested clicks, 
                // usually we handle clicks separately if needed.
            }
            if (onCancel) onCancel(e);
        },
        [onClick, isLongPressActive, onCancel]
    );

    return {
        onMouseDown: start,
        onMouseUp: cancel,
        onMouseLeave: cancel,
        onTouchStart: start,
        onTouchEnd: cancel,
    };
};
