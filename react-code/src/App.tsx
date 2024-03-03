// react
import React, { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
// pages
import { Home } from './pages/Home';
import { Config } from './pages/Config';
import { Edit } from './pages/Edit';
// components
import { TheNavigation } from './components/TheNavigation';
import { ConfigProvider } from 'antd';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
                const response = await fetch('/supl/www/api/getLoginStatus');
                const data = await response.json();
                setIsLoggedIn(data.isLoggedIn);
            } catch (e) {
                console.error(e);
            }
        };
      
        checkLoginStatus();
    }, []);
    
    return (
        <div className="App">
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#FF7E00',
                        colorLink: '#003A53',
                        borderRadius: 12,
                    }
                }}
            >
                <Router>
                    <header>
                        <TheNavigation isLoggedIn={isLoggedIn} />
                    </header>

                    <main>
                        <Routes>
                            <Route path='/supl/www/config' element={isLoggedIn ? <Config /> : <Redirect />} />
                            <Route path='/supl/www/dashboard' element={isLoggedIn ? <Edit /> : <Redirect />} />
                            <Route path='/supl/www/' element={<Home />} />
                        </Routes>
                    </main>

                    <footer>
                        {/* <p>© 2023 - 2024 Daniel Žitník</p> */}
                    </footer>
                </Router>
            </ConfigProvider>
        </div>
    );
}

const Redirect = () => {
    useEffect(() => {
        window.location.replace('http://localhost:8080/supl/www/sign/in');
    }, []);

    return (
        <div></div>
    )
}

export default App;
