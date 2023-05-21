import React from 'react'
import styled, { css } from 'styled-components'
import './nav.css'
import { useState, useContext } from 'react'
import { AppContext } from './App'

export const NavDiv = styled.div`
	background-color: #FFFFFF;
	display: flex;
	position: relative;
	width: 100%;
	height: 70px;
	max-height: max-content;
	justify-content: end;
	align-items: center;
    background-color: transparent;
`

const item = css`
	color:#BEBEBE;
	margin-left:1rem;
	margin-right:1rem;
	cursor: pointer;

	&:hover{
		color:#000000;
		transition: .4s;
	}

	&:not(:hover){
		transition: .4s;
	}
`
const NavItem = styled.div`
    font-size: 20px;
    position: relative;
    display: block;
    font-family: 'Poppins', sans-serif;
    ${item};
`

const NavOption = styled.nav`
    position: relative;
    width: 280px;
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
    z-index: 1;
    text-align: center;
    cursor: pointer;
    font-family: 'Sunflower', sans-serif;
`

const CurruntSelect = styled.div`
    position: absolute;
    top: 0;
    left: ${(props) => props.left};
    width: ${(props) => props.width};
    height: 100%;
    background-color: #faf6c5;
    border-radius: 8px;
    transition: all.3s ease;
`

const Navbar = () => {
    const { location, setLocation } = useContext(AppContext);

    return (
        <NavDiv>
            <NavOption>
                <OptionItem onClick={() => { setLocation({ left: '0px', width: '88px', margin_left : '0' }) }}>Upload</OptionItem>
                <OptionItem onClick={() => { setLocation({ left: '88px', width: '85px', margin_left : '-100%' }) }}>Sing in</OptionItem>
                <OptionItem onClick={() => { setLocation({ left: '173px', width: '103px', margin_left : '-200%' }) }}>Statistics</OptionItem>
                <CurruntSelect left={location.left} width={location.width} />
            </NavOption>
        </NavDiv>
    )

}

export default Navbar

