import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRef } from "react";
import axios from 'axios';

const C = styled.div`
    display: flex;
    flex-direction: column;
    width: 33%;
    margin: 0;
    padding: 0;
    padding-bottom: 20px;
    margin-top: 20px;
    justify-content: center;
    border: solid 2px;
    border-radius: 15px;
    border-color: wheat;
    backdrop-filter: blur(10px);
`

const OptionsContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    max-height: fit-content;
`

const TargetImg = styled.img`
    position: relative;
    margin: 20px;
    padding: 0;
    object-fit: contain;
    max-height: 620px;
`

const UploadPage = () => {
    const selectFile = useRef("")
    const uploadedImg = useRef()
    const [modelRes, setModelRes] = useState({})
    const [originalSize, setOriginalSize] = useState({})
    const [imgPath, setImgPath] = useState("/de.png")

    const handleChange = async e => {
        let img = new Image()
        const i = e.target.files[0]

        img.onload = () => { setOriginalSize({ w: img.width, h: img.height }) }
        img.src = URL.createObjectURL(i)
        setImgPath(URL.createObjectURL(i))

        let formData = new FormData()
        formData.append('image', i)
        const imgBoundboxResponse = await axios.post('/uploadImage', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        setModelRes(imgBoundboxResponse)
        // console.log(uploadedImg.current.offsetWidth)
        // console.log(uploadedImg.current.offsetHeight)
        // console.log(uploadedImg.current.getBoundingClientRect().left)
        // console.log(uploadedImg.current.getBoundingClientRect().top)
    }

    return (<C>
        <input onChange={handleChange} type="file" accept=".jpg, .jpeg, .png, .heic" style={{ display: "none" }} ref={selectFile} />
        <OptionsContainer>
            <button onClick={() => console.log(modelRes)}>vb</button>
            <img style={{ cursor: 'pointer', margin: '10px' }} width={70} height={70} src={'/l.svg'} alt='sorry' onClick={() => { }} />
            <img style={{ cursor: 'pointer', margin: '10px' }} width={70} height={70} src={'/r.svg'} alt='sorry' onClick={() => { }} />
            <img style={{ cursor: 'pointer', margin: '10px' }} width={70} height={70} src={'/upload-image.svg'} alt='sorry' onClick={() => selectFile.current.click()} />
        </OptionsContainer>
        <TargetImg src={imgPath} ref={uploadedImg} />
    </C>)
}

export default UploadPage