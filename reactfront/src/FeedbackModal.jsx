import React from 'react';
import styled from 'styled-components'
import { motion, AnimatePresence } from "framer-motion"

const Background = styled(motion.div)`
    position: fixed;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
`
const FeedbackModal = styled(motion.div)`
    display: flex;
    border-radius: 20px;
    width: 900px;
    height: 600px;
    background-color: white;
    z-index: 999;
    justify-content: center;
    align-items: center;
`

const FeedbackModalPage = ({ setter }) => {

    return (
        <Background initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} onClick={() => { setter(false) }}>
            <FeedbackModal initial={{ y: -50 }} animate={{ y: 0 }} exit={{ opacity: 0, y: -30 }} />
        </Background>
    )
}

export default FeedbackModalPage