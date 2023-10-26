import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './auth.css'

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
    return (
    <div className="login-page">
        <h1 className="title">GiggleStack</h1>
        <h3 className="line-1 anim-typewriter">The future of Jokes is here.</h3>
        <div className="sub-body">
            <img src={require('../../images/pepe.png')} alt="pepe" className="pepe-img" width="auto" height={200}/>
            <div className="fade-grid">
                <p className="fade-text-1">Go Ahead.</p>
                <p className="fade-text-2">Sign In.</p>
            </div>
        </div>
        <button className="google-login" onClick={signInWithGoogle}>
            Sign In With Google
        </button>
    </div>
    )
}