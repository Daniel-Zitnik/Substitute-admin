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
                const response = await fetch(process.env.BASE_URL + 'api/getLoginStatus');
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
                    components: {
                        DatePicker: {
                            cellWidth: window.screen.width <= 720 ? (window.screen.width - 60) / 6.944 : 36,
                            cellHeight: window.screen.width <= 720 ? (window.screen.width - 60) / 10.416 : 24,
                            inputFontSize: 50,
                        },
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
                            <Route path={process.env.BASE_URL + 'config'} element={<Config />} />
                            <Route path={process.env.BASE_URL + 'dashboard'} element={<Edit />} />
                            <Route path={process.env.BASE_URL} element={<Home />} />
                        </Routes>
                    </main>

                    <footer>
                        <p>© 2024 Daniel Žitník</p>
                    </footer>
                </Router>
            </ConfigProvider>
        </div>
    );
}

export default App;
