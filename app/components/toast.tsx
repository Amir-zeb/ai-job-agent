import { useEffect, useState } from "react";

interface ToastT {
    type: 'Error' | 'Success' | 'Warning' | null,
    message: string | null
}

const Toast = ({ type, message }: ToastT) => {
    const [open, setOpen] = useState(false);
    const bgColor = type === "Success" ? 'bg-green-200' : type === "Error" ? ' bg-red-200' : 'bg-yellow-200';
    const containerBgColor = type === "Success" ? 'bg-green-50' : type === "Error" ? ' bg-red-50' : 'bg-yellow-50';

    useEffect(() => {
        if (!message) {
            setOpen(false);
            return;
        }

        setOpen(true);

        const timer = window.setTimeout(() => {
            setOpen(false);
        }, 2000);

        return () => window.clearTimeout(timer);
    }, [message]);

    if (!open || !message) {
        return null;
    }

    return (
        <div className="fixed top-2.5 right-2.5 z-10">
            <div className={`flex items-center w-full max-w-sm p-4 text-body bg-green-50 shadow-xs rounded ${containerBgColor}`} role="alert">
                <div className={`inline-flex items-center justify-center shrink-0 w-7 h-7 rounded ${bgColor}`}>
                    {type === "Success" &&
                        <>
                            <svg className="w-5 h-5 text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" /></svg>
                            <span className="sr-only">Check icon</span>
                        </>
                    }
                    {type === "Error" &&
                        <>
                            <svg className="w-5 h-5 text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" /></svg>
                            <span className="sr-only">Error icon</span>
                        </>
                    }
                    {type === "Warning" &&
                        <>
                            <svg className="w-5 h-5 text-yellow-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                            <span className="sr-only">Warning icon</span>
                        </>
                    }
                </div>
                <div className="ms-3 text-sm font-normal">{message}</div>
            </div>
        </div>
    );
}

export default Toast;