import React, { useEffect, useRef } from 'react';
import styled from 'styled-components'
import { motion } from "framer-motion"
import Dropdown from './dropdown';

const Container = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: fit-content;
    width: 900px;
    background-color: white;
    border-radius: 20px;
    z-index: 999;
`

const Title = styled.div`
    width: 90%;
    height: fit-content;
    text-align: left;
    font-size: 40px;
    margin: 20px;
`

const FeedbackSubmitBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background-color: transparent;
    user-select: none;
    height: 50px;
    width: 100px;
    margin: 20px 20px 20px 10px;
    border: solid 2px gray;
    cursor: pointer;
    transition: background-color .5s;
    &:hover{
        background-color: #faf6c5;
    }
`

const FeedbackModalFooter = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
    height: fit-content;
`
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
    justify-content: space-around;
    width: 900px;
    height: 400px;
    background-color: transparent;
    z-index: 999;
    align-items: center;
`

const FeedbackModalPage = ({ setter, boundboxSize }) => {

    const canvasref = useRef()

    const handleModalClick = (event) => {
        event.stopPropagation()
    }

    useEffect(() => {
        if (boundboxSize !== {}) {
            let img = new Image()
            img.src = boundboxSize.imgPath
            const canvas = canvasref.current
            const context = canvas.getContext('2d')
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            const scale = Math.min(canvas.width / boundboxSize.boxWidth, canvas.height / boundboxSize.boxHeight)
            const scaledWidth = boundboxSize.boxWidth * scale
            const scaledHeight = boundboxSize.boxHeight * scale
            const x = (canvas.width - scaledWidth) / 2
            const y = (canvas.height - scaledHeight) / 2
            context.drawImage(img, boundboxSize.xOffset, boundboxSize.yOffset, boundboxSize.boxWidth, boundboxSize.boxHeight, x, y, scaledWidth, scaledHeight)
        }
    })

    return (
        <Background initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} onClick={() => { setter(false) }}>
            <Container onClick={handleModalClick} initial={{ y: -50 }} animate={{ y: 0 }} exit={{ opacity: 0, y: -30 }}>
                <Title>해당 사진의 카테고리를 알맞게 피드백</Title>
                <FeedbackModal >
                    <canvas ref={canvasref} width={1020} height={1080} style={{ objectFit: 'contain', maxHeight: 700, maxWidth: 700, padding: '30px' }} />
                    <Dropdown />
                </FeedbackModal>
                <FeedbackModalFooter><FeedbackSubmitBtn onClick={() => { setter(false) }}><p style={{ fontSize: '20px' }}>Submit</p></FeedbackSubmitBtn></FeedbackModalFooter>
            </Container>
        </Background >
    )
}

export default FeedbackModalPage