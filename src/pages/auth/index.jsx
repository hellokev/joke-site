import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
    const navigate = useNavigate();
    

    const signInWithGoogle = async () => {
        const results = await signInWithPopup(auth, provider);
        const authInfo = {
            userID: results.user.uid,
            name: results.user.displayName,
            profilePhoto: results.user.photoURL,
            isAuth: true,
        }
        localStorage.setItem("auth", JSON.stringify(authInfo));
        navigate("/main")
    }
    return <div className="login-page">
        <p>Sign in with Google to Continue</p>
        <button className="google-login" onClick={signInWithGoogle}>
            Sign In With Google
        </button>
    </div>
}