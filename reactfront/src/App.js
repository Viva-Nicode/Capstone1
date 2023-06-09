import React from 'react';
import { useState, createContext, useEffect } from 'react';
import styled from 'styled-components'
import UploadPage from './uploadPage';
import Login from './login';
import Navbar from './navbar';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import FeedbackModalPage from './FeedbackModal';
import { motion, AnimatePresence } from "framer-motion"
import Statistics from './statistics';

export const AppContext = createContext()
export const AppContext2 = createContext()
export const AccessTokenContext = createContext()

const ViewContainer = styled.div`
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 90vw;
    overflow: hidden;
`
const Veiws = styled(motion.div)`
    display: flex;
    align-items: center;
    width: 300%;
    margin-left: ${(props) => props.margin};
    margin-right: 0;
    padding: 0;
    transition: margin-left .2s ease-out;
`
const Screen = styled.div`
    position: fixed;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: ${(props) => props.display};
`
const LoadingModal = styled.div`
    display: flex;
    border-radius: 20px;
    width: 400px;
    height: 400px;
    background-color: transparent;
    z-index: 999;
    justify-content: center;
    align-items: center;
`
const Spinner = styled.div`
    position: relative;
    width: 200px;
    height: 200px;
    background: conic-gradient(#0000 10%, #8f44fd);
    border-radius: 50%;
    -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 20px), #000 0);
    animation: anime .8s infinite linear;
    @keyframes anime{
        100%{
            transform: rotate(360deg);
        }
    }
`

function App() {

    const [location, setLocation] = useState({
        left: '0px',
        width: "88px",
        margin_left: '0',
    })

    const [modalactive, setmodalactive] = useState('none')
    const [accessToken, setAccessToken] = useState({ access_token: 'notting' })
    const [cookies] = useCookies(['refreshToken'])
    const [feedbackModalActive, setFeedbackModalActive] = useState(false)
    const [boundboxSize, setBoundboxSize] = useState({})

    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const response = await axios.post('/getAccess', null, {
                    headers: {
                        Authorization: `Bearer ${cookies.refreshToken}`,
                    },
                })
                setAccessToken({ access_token: response.data.access_token, email: response.data.email })
            } catch (error) {
                console.log('not logined')
            }
        }
        getAccessToken()
    }, [])

    return (
        <AppContext.Provider value={{ location, setLocation }}>
            <AppContext2.Provider value={{ modalactive, setmodalactive }}>
                <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
                    <Navbar />
                    <ViewContainer>
                        <Veiws margin={location.margin_left}>
                            <UploadPage setter={setFeedbackModalActive} setBoundboxSize={setBoundboxSize} curruntView={location.margin_left} accessToken={accessToken.access_token} />
                            <Login />
                            <Statistics curruntView={location.margin_left} accessToken={accessToken.access_token}/>
                        </Veiws>
                    </ViewContainer>
                    <Screen display={modalactive}>
                        <LoadingModal >
                            <Spinner />
                        </LoadingModal>
                    </Screen>
                    <AnimatePresence>
                        {feedbackModalActive ? <FeedbackModalPage setter={setFeedbackModalActive} boundboxSize={boundboxSize} /> : null}
                    </AnimatePresence>
                </AccessTokenContext.Provider>
            </AppContext2.Provider>
        </AppContext.Provider>)
}
export default App;
