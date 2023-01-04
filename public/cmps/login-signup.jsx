import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { LoginForm } from './login-form.jsx'
import { userService } from '../services/user.service.js'

const { useState } = React
const { useNavigate } = ReactRouterDOM


export function LoginSignup({ onChangeLoginStatus }) {
    const navigate = useNavigate()
    const [isSignup, setIsSignUp] = useState(false)

    function onLogin(credentials) {
        isSignup ? signup(credentials) : login(credentials)
    }

    function login(credentials) {
        userService.login(credentials)
            .then(onChangeLoginStatus)
            .then(() => {
                navigate('/user')
                showSuccessMsg('Logged in successfully')
            })
            .catch((err) => { showErrorMsg('Oops try again') })
    }

    function signup(credentials) {
        console.log('credentials cmp = ', credentials)
        userService.signup(credentials)
            .then(onChangeLoginStatus)
            .then(() => { showSuccessMsg('Signed in successfully') })
            .catch((err) => { showErrorMsg('Oops try again') })
    }

    return (
        <div className="login-page">
            <LoginForm
                onLogin={onLogin}
                isSignup={isSignup}
            />
            <div className="btns">
                <a href="#" onClick={() => setIsSignUp(!isSignup)}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </a >
            </div>
        </div >
    )
}
