// react
import React from 'react'
import { Link } from 'react-router-dom';
// style
import '../style/app.less';

type Props = {
    isLoggedIn: boolean;
}

export const TheNavigation = (props: Props) => {
    const { isLoggedIn } = props;

    return (
        <nav>                               
            <h1><Link to="/supl/www/">Suplování</Link></h1>

            {isLoggedIn ? <ul className='admin-nav'>
                <li><Link to="/supl/www/dashboard">Editace</Link></li>
                <li><Link to="/supl/www/config">Konfigurace</Link></li>

                <li><a href="/supl/www/sign/out">Odhlásit se</a></li>
            </ul> :
            <ul>
                <li><a href="/supl/www/sign/in">Editovat</a></li>
            </ul>}
        </nav>
    )
}