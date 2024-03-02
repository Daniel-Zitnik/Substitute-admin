import React from 'react'
import { Link } from 'react-router-dom';

type Props = {
    isLoggedIn: boolean;
}

export const TheNavigation = (props: Props) => {
    const { isLoggedIn } = props;

    return (
        <nav>                               
            <h1><Link to="/supl/www/">Suplování</Link></h1>

            {isLoggedIn ? <div>
                <Link to="/supl/www/dashboard">Dashboard</Link>
                <Link to="/supl/www/config">Konfigurace</Link>

                <a href="/supl/www/sign/out">Odhlásit se</a>
            </div> :
            <div>
                <a href="/supl/www/sign/in">prihlasit se</a>
            </div>}
        </nav>
    )
}