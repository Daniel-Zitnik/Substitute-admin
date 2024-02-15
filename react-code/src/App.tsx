// react
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Button } from 'antd';
// pages
import { Home } from './pages/Home';
import { Config } from './pages/Config';
import { Edit } from './pages/Edit';
// components
import { TheNavigation } from './components/TheNavigation';

function App() {
    return (
        <div className="App">
            <Router>
                <header>
                    <TheNavigation />
                </header>

                <main>
                    <Routes>
                        <Route path='/supl/www/config' element={<Config />} />
                        <Route path='/supl/www/dashboard' element={<Edit />} />
                        <Route path='/supl/www/' element={<Home />} />
                    </Routes>
                </main>

                <footer>
                    {/* <p>© 2023 - 2024 Daniel Žitník</p> */}
                </footer>
            </Router>
        </div>
    );
}

export default App;
