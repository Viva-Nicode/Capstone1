import React, { useState, useEffect, useRef, useReducer } from 'react'
import styled from 'styled-components'
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

const LoadingModal = styled.div`
    display: ${(props) => props.display};
    position: fixed;
    z-index: 9999;
    width: 500px;
    height: 500px;
    background-color: white;
`

const UploadPage = () => {
    const selectFile = useRef("")
    const uploadedImg = useRef()
    const canvasref = useRef()
    const [modelRes, setModelRes] = useState({})
    const [drawnImage, setDrawnImgae] = useState({})
    const [originalSize, setOriginalSize] = useState({})
    const [imgPath, setImgPath] = useState("/de.png")
    const [modalActive, setModalActive] = useState('none')

    const [boundboxIdx, dispatch] = useReducer((state, action) => {

        if (!modelRes?.score || modelRes?.score?.length <= 0)
            return state

        const lastidx = modelRes.score.length - 1
        switch (action.type) {
            case 'INCREMENT':
                return state + 1 > lastidx ? 0 : state + 1
            case 'DECREMENT':
                return state - 1 < 0 ? lastidx : state - 1
            default:
                return state
        }
    }, -1)

    const handleChange = async e => {
        let img = new Image()
        const i = e.target.files[0]

        img.onload = () => { setOriginalSize({ w: img.width, h: img.height }) }
        img.src = URL.createObjectURL(i)
        setImgPath(URL.createObjectURL(i))

        checkValues('block')
        let formData = new FormData()
        formData.append('image', i)
        const imgBoundboxResponse = await axios.post('/uploadImage', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        setModelRes(imgBoundboxResponse.data)
        checkValues('none')
    }

    useEffect(() => {
        const canvas = canvasref.current
        const context = canvas.getContext('2d')
        const img = uploadedImg.current

        img.onload = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
            const scaledWidth = img.width * scale
            const scaledHeight = img.height * scale
            const x = (canvas.width - scaledWidth) / 2
            const y = (canvas.height - scaledHeight) / 2

            context.drawImage(img, x, y, scaledWidth, scaledHeight)
            setDrawnImgae({ x: x, y: y, w: scaledWidth, h: scaledHeight })
        }
        img.src = imgPath

        if (boundboxIdx === -1)
            dispatch({ type: 'INCREMENT' })
    }, [imgPath])

    useEffect(() => {
        if (boundboxIdx === -1)
            return
        const canvas = canvasref.current
        const context = canvas.getContext('2d')
        const img = uploadedImg.current

        context.strokeStyle = 'red'
        context.lineWidth = 3

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, drawnImage.x, drawnImage.y, drawnImage.w, drawnImage.h)
        const text = modelRes.classNames[boundboxIdx]
        const score = modelRes.score[boundboxIdx]
        const points = modelRes.boundBoxCoordinates.slice(boundboxIdx * 4, boundboxIdx * 4 + 4)
        const xOffset = drawnImage.x + drawnImage.w * points[1]
        const yOffset = drawnImage.y + drawnImage.h * points[0]
        const boxWidth = drawnImage.w * points[3] - xOffset + drawnImage.x
        const boxHeight = drawnImage.h * points[2] - yOffset + drawnImage.y

        context.strokeRect(xOffset, yOffset, boxWidth, boxHeight)
        const textWidth = context.measureText(text + ' ' + score.toFixed(2)).width;
        context.fillStyle = 'white';
        context.fillRect(xOffset + 2, yOffset + 2, textWidth + 5, 25)
        context.font = '20px Arial'
        context.fillStyle = 'blue'
        context.fillText(text + ' ' + score.toFixed(2), xOffset + 3, yOffset + 20)

    }, [boundboxIdx])


    const checkValues = (state) => {
        setModalActive(state)
    }

    return (<C>
        <input onChange={handleChange} type="file" accept=".jpg, .jpeg, .png, .heic" style={{ display: "none" }} ref={selectFile} />
        <OptionsContainer>
            {/* <button onClick={checkValues}>v</button> */}
            <img style={{ cursor: 'pointer', marginTop: 22, marginRight: 25 }} width={30} height={50} src={'/l.svg'} alt='sorry' onClick={() => { dispatch({ type: 'DECREMENT' }) }} />
            <img style={{ cursor: 'pointer', marginTop: 22, marginLeft: 20, marginRight: 15 }} width={30} height={50} src={'/r.svg'} alt='sorry' onClick={() => { dispatch({ type: 'INCREMENT' }) }} />
            <img style={{ cursor: 'pointer', margin: '10px' }} width={70} height={70} src={'/upload-image.svg'} alt='sorry' onClick={() => selectFile.current.click()} />
        </OptionsContainer>
        <canvas ref={canvasref} style={{ objectFit: 'contain', maxHeight: 620 }} />
        <img src={imgPath} ref={uploadedImg} style={{ display: 'none' }} alt='sorry' />
        <LoadingModal display={modalActive} />
    </C>)
}
// 로딩모달 완성
// 몇개의 객체찾았는지 표시
export default UploadPage