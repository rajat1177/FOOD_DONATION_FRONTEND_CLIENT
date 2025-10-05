// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import axios from "axios";
import { Loading } from "../components/Loading"
import { useNavigate } from "react-router-dom";

export const ResetForm = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const handleResetPass = async () => {
        setLoading(true)
        if (!email) {
            setError("Please enter Email");
            setLoading(false)
            return;
        }
        try {
            setLoading(true)
            const response = await axios.post('http://56.228.24.94/api/user/reset-verification',
                { email: email });
            if (response.status === 200) {
                navigate(`/reset-password-verification?email=${email}`);
            } else {
                console.log("Reset Password Failed: ", response.data.message);
            }

        } catch (err) {
            if (err.response) {
                console.log("Error Occurred", err.response.data.message);
                setError(err.response.data.message || "Error Occurred");
            }
            else {
                console.log("Error logging in: ", err.message);
                setError("Something went wrong, try again!");
            }
        }finally{
            setLoading(false)
        }

    }
    return (
        <div className="h-screen bg-primaryCol flex flex-col items-center justify-center">
            <div className="w-96 text-center p-8 bg-gray-100 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold">Verify Email</h2>
                <div className="my-4">
                    <InputBox
                        placeholder="abc@gmail.com"
                        label={"Email"}
                        type={"text"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {loading ? (<Loading/>):(
                    <Button label={"Verify OTP"} onClick={handleResetPass} />
                )}
                
            </div>
        </div>
    )
}