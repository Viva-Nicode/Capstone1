import React, { useState } from 'react';
import styled, { css } from 'styled-components'
import { motion, AnimatePresence } from "framer-motion"

const MenusContainer = styled(motion.div)`
    display: flex;
    width: 140px;
    flex-direction: column;
    max-height: fit-content;
    margin-right: 35px;
`

const MenuCss = css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
    padding: 0;
    height: 40px;
    border: solid 1px #eeeaea;
    background-color: #eeeaea;
    border-radius: 3px;
    margin: 5px 0px 5px 0px;
    cursor: pointer;
    transition: background-color .5s;
    &:hover{
        background-color: #faf6c5;
    }
`
const DefaultMenu = styled(motion.div)`
    ${MenuCss};
`

const Menu = styled(motion.div)`
    ${MenuCss};
`
const OptionName = styled.p`
    user-select: none;
    font-size: 20px;
`
const menus = ["battery", "cardboard", "clothes", "glass", "metal", "plastic", "shoes"]


const Dropdown = () => {
    const [visibleMenus, setVisibleMenus] = useState(false)
    const [userSelect, setUserSelect] = useState('Select')

    return (
        <MenusContainer>
            <p style={{ userSelect: 'none' }}>아래를 눌러 선택</p>
            <AnimatePresence>
                <DefaultMenu transition={{ duration: 0.8 }} onClick={() => { setUserSelect('Select'); setVisibleMenus(true) }}><OptionName>{userSelect}</OptionName></DefaultMenu>
                {visibleMenus &&
                    menus.map((elem, idx) => (<Menu onClick={() => { setUserSelect(elem); setVisibleMenus(false) }} initial={{ y: 0, scale: 0, opacity: 0 }} transition={{ duration: .2, ease: [0, 0.71, 0.2, 1.01] }} exit={{ scale: 0, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}><OptionName key={idx}>{elem}</OptionName></Menu>))
                }
            </AnimatePresence>
        </MenusContainer>)
}

export default Dropdown