import React from 'react'
import { Link } from 'react-router-dom';

type Props = {}

export const TheNavigation = (props: Props) => {
    return (
        <nav>                               
            <h1><Link to="/supl/www/">Suplování</Link></h1>

            <Link to="/supl/www/dashboard">Dashboard</Link>
            <Link to="/supl/www/config">Konfigurace</Link>

            <a href="/supl/www/sign/out">Odhlásit se</a>
        </nav>
    )
}

export default TheNavigation