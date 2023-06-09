import React from 'react'
import styled from 'styled-components'
import './nav.css'
import { useContext } from 'react'
import { AppContext, AccessTokenContext } from './App'


export const NavDiv = styled.div`
	background-color: #FFFFFF;
	display: flex;
	position: relative;
	width: 100%;
	height: 70px;
	max-height: max-content;
	justify-content: space-between;
	align-items: center;
    background-color: transparent;
    z-index: 0;
`

const NavOption = styled.nav`
    position: relative;
    width: 290px;
    height: 50px;
    background-color: white;
    border-radius: 8px;
    border-color: #BEBEBE;
    box-sizing: border-box;
    margin: 0;
    margin-right: 2%;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`

const OptionItem = styled.span`
    margin-left: 20px;
    margin-right: 20px;
    font-size: 1em;
    z-index: 2;
    text-align: center;
    cursor: pointer;
    font-family: 'Sunflower', sans-serif;
    user-select: none;
`

const CurruntSelect = styled.div`
    position: absolute;
    top: 0;
    left: ${(props) => props.left};
    width: ${(props) => props.width};
    height: 100%;
    background-color: #faf6c5;
    border-radius: 8px;
    transition: all .2s ease;
`

const Logo = styled.div`
    display: flex;
`

const Navbar = () => {
    const { location, setLocation } = useContext(AppContext)
    const { accessToken, setAccessToken } = useContext(AccessTokenContext)

    return (
        <NavDiv>
            <Logo>
                <img width={55} height={55} style={{ marginTop: 30, marginLeft: 20, marginRight: 20, userSelect: 'none' }} src='/save-earth.ico' />
                <span style={{ position: "relative", top: 40, fontFamily: 'Dancing Script, cursive', fontSize: '2em', userSelect: 'none' }}>SaveEarth</span>
            </Logo>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ textAlign: 'center', marginTop: 15, marginRight: 20, userSelect: 'none' }}>{accessToken.email || ''}</span>
                <NavOption>
                    <OptionItem onClick={() => { setLocation({ left: '0px', width: '88px', margin_left: '0' }) }}>Upload</OptionItem>
                    <OptionItem onClick={() => { setLocation({ left: '88px', width: '85px', margin_left: '-100%' }) }}>Sing in</OptionItem>
                    <OptionItem onClick={() => { setLocation({ left: '177px', width: '103px', margin_left: '-200%' }) }}>Statistics</OptionItem>
                    <CurruntSelect left={location.left} width={location.width} />
                </NavOption>
            </div>
        </NavDiv>
    )

}

export default Navbar

