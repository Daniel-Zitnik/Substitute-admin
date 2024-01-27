import React, { useState } from 'react'

type Props = {}

export const Home = (props: Props) => {
    const [count, setCount] = useState(0);

    return (
        <div onClick={() => {
            setCount (prev => prev + 1);
            }}>
            
            {count > 0 ? <p>You've clicked the logo {count} times</p> : <p>Click the logo!</p>}
        </div>
    )
}

export default Home