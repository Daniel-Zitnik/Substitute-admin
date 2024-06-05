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
// style
import './style/app.less';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // get user logged in status
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

    // change no data text
    const customEmpty = () => (
        <div style={{ textAlign: 'center' }}>
            <p>Žádná data</p>
        </div>
    );
    
    return (
        <div className="App">
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#F4801A',
                        colorLink: '#C34600',
                        borderRadius: 12,
                        colorTextBase: '#111',
                    },
                }}
                renderEmpty={customEmpty}
            >
                <Router>
                    <header>
                        <TheNavigation isLoggedIn={isLoggedIn} />
                    </header>

                    <main>
                        <Routes>
                            <Route path='/supl/www/config' element={<Config />} />
                            <Route path='/supl/www/dashboard' element={<Edit />} />
                            <Route path='/supl/www/' element={<Home />} />
                        </Routes>
                    </main>

                    <footer>
                        <p>© 2023 - 2024 Daniel Žitník</p>
                    </footer>
                </Router>
            </ConfigProvider>
        </div>
    );
}

export default App;
