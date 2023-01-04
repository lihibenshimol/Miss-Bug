const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM
import routes from './routes.js'

import { AppHeader } from './cmps/app-header.jsx'
import { AppFooter } from './cmps/app-footer.jsx'
import { BugEdit } from './views/bug-edit.jsx'

export function App() {

    return <Router>
        <div>
            <AppHeader />
            <main>
                <Routes>
                    {routes.map(route =>
                        <Route key={route.path} element={<route.component />} path={route.path} />
                    )}
                    <Route element={<BugEdit/>} path="/bug/edit/:bugId"/>
                    <Route element={<BugEdit/>} path="/bug/edit"/>
                </Routes>
            </main>
            <AppFooter />
        </div>
    </Router>

}


