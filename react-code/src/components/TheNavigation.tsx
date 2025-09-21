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
            <h1><Link to={process.env.BASE_URL + ''}>Suplování</Link></h1>

            {isLoggedIn ? <ul className='admin-nav'>
                <li><Link to={process.env.BASE_URL + 'dashboard'}>Editace</Link></li>
                <li><Link to={process.env.BASE_URL + 'config'}>Konfigurace</Link></li>

                <li><a href={process.env.BASE_URL + 'sign/out'}>Odhlásit se</a></li>
            </ul> :
            <ul>
                <li><a href={process.env.BASE_URL + 'sign/in'}>Editovat</a></li>
            </ul>}
        </nav>
    )
}