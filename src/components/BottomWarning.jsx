import { Link } from "react-router-dom";

export function BottomWarning({ label, buttonText, to }) {
    // console.log("BottomWarning rendered with:", { label, buttonText, to }); 
    return (
        <div className="py-2 text-sm flex justify-center">
            <div>{label}</div>
            {buttonText && to && (
                <Link className="pointer underline pl-1 text-blue-600 cursor-pointer" to={to}>
                    {buttonText}
                </Link>
            )}
        </div>
    );
}