const { NavLink, useNavigate } = ReactRouterDOM
const { useEffect, useState } = React

import { UserMsg } from './user-msg.jsx'
import { userService } from '../services/user.service.js'
import { LoginSignup } from './login-signup.jsx'

export function AppHeader() {
    const navigate = useNavigate()
    const [user, setUser] = useState(userService.getLoggedinUser())

    function onChangeLoginStatus(user) {
        setUser(user)
    }
    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
                navigate('/')
            })
    }

    return (
        <header className="app-header main-layout full">
            <h1><img className='header-logo' src="./assets/img/logo.png" /> Buggers</h1>
            <UserMsg />
            <div>
            <nav>
                <NavLink to="/">Home</NavLink> |
                <NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink> |
                {user && <NavLink to="/user">User Details</NavLink>} |
                {user && user.isAdmin && <NavLink to="/list">User List</NavLink> }
            </nav>
            </div>
            
            {user ? (
                < section >
                    <h2>Hello {user.fullname}</h2>
                    <button onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
        </header>
    )
}
