import React from 'react';
import { useState, useEffect, createContext } from 'react';
import styled from 'styled-components'
import UploadPage from './uploadPage';
import Login from './login';
import Navbar from './navbar';

export const AppContext = createContext();

const ViewContainer = styled.div`
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 90vw;
    overflow: hidden;
`

const Veiws = styled.div`
    display: flex;
    align-items: center;
    width: 300%;
    margin-left: ${(props) => props.margin};
    margin-right: 0;
    padding: 0;
    transition: margin-left .5s ease-out;
`

function App() {

    const [location, setLocation] = useState({
        left: '0px',
        width: "88px",
        margin_left: '0'
    })

    return (<AppContext.Provider value={{ location, setLocation }}>
        <Navbar />
        <ViewContainer>
            <Veiws margin={location.margin_left}>
                <UploadPage />
                <Login />
            </Veiws>
        </ViewContainer>
    </AppContext.Provider>)
}

export default App;
