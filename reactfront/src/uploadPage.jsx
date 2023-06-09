import React, { useState, useEffect, useRef, useReducer, useContext } from 'react'
import styled from 'styled-components'
import axios from 'axios';
import { AppContext2 } from './App'

const CommentContainer = styled.div`
    position: relative;
    width: 80%;
    margin-top :2%;
    background-color: #faf6c5;
    height: fit-content;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    border-radius: 30px;
`
const C = styled.div`
    display: flex;
    flex-direction: column;
    width: 33%;
    margin: 0;
    padding: 0;
    padding-bottom: 20px;
    margin-top: 20px;
    justify-content: center;
    margin-left: 1%;
    border: solid 2px;
    border-radius: 15px;
    border-color: wheat;
`

const OptionsContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    max-height: fit-content;
`

const DetectionComment = styled.div`
    width: max-content;
    height: 50px;
    margin-right: 20px;
    padding-top: 30px;
    font-size: 1.5em;
    text-align: center;
    user-select: none;
    display: ${(props) => props.display};
`

const emitSolutions = {
    plastic: <p><big style={{ fontSize: '30px' }}>해당 사진은 플라스틱류로 보여집니다.</big><br /><br />
        페트병과 플라스틱 용기는 물로 헹구어 곁면의 이물질과 용기 안 내용물을 깨끗이 비워야 합니다.<br /><br />
        부탁 상표와 뚜껑등 다른 재질로 된 부분은 제거해 주어야 합니다.<br /><br />
        알약 포장재와 카세트테이프 등 여러 재질이 섞이고 분리가 어려운 제품은 종량제봉투에 담아 버려주세요.<br /><br />
        만약 투명 페트병 전용 배출함이 있다면 투명 페트병 전용 배출함을 이용해야 합니다.<br /><br />
        플라스틱 이외의 재질이 부착된 완구·문구류, 옷걸이, 칫솔, 파일철, 전화기, 등의 경우는 종량제봉투, 특수규격마대 또는 대형폐기물 처리 등 지자체 조례에 따라 배출해주세요.<br /><br /></p>,
    metal: <p><big style={{ fontSize: '30px' }}>해당 사진은 캔류으로 보여집니다.</big><br /><br />
        음료수캔, 맥주캔, 통조림캔 등의 경우 내용물을 비우고 물로 헹구는 등 이물질을 제거하여 배출하고 담배꽁초 등 이물질을 넣지 않아야 합니다.<br /><br />
        플라스틱 뚜껑 등 금속캔과 다른 재질은 제거한 후 배출해야 합니다.<br /><br />
        만일 부탄가스나 스프레이 등이라면 환기가 잘 되는 곳에서 구멍을 뚫어 가스를 빼준 후 배출해야 합니다.<br /><br />
        재질별로 분리가 곤란한 경우에는 종량제봉투, 특수규격마대 또는 대형폐기물 처리 등 지자체 조례에 따라 배출해야 합니다.<br /><br /></p>,
    glass: <p><big style={{ fontSize: '30px' }}>해당 사진은 유리병류로 보여집니다.</big><br /><br />
        탄산음료병이나 맥주병, 소주병은 담배꽁초와 같은 이물질을 넣지 말고 버려주세요.<br /><br />
        하지만 거울, 깨진 유리, 도자기류,유리 식기류는 유리병류가 아니기 때문에 깨진 유리제품은 신문지 등에 싸서 종량제봉투나 전용 마대에 버려주세요.<br /><br />
        소주, 맥주 등 빈용기보증금 대상 유리병은 소매점 등으로 반납하여 보증금 환급이 가능합니다.<br /><br />
        코팅 및 다양한 색상이 들어간 유리제품, 내열 유리제품, 크리스탈 유리제품, 사기·도자기류 등은 특수규격마대 또는 대형폐기물 처리 등 지자체 조례에 따라 배출해야 합니다.<br /><br /></p>,
    clothes: <p><big style={{ fontSize: '30px' }}>해당 사진은 의류로 보여집니다.</big><br /><br />
        옷이 비교적 깨끗하고 다른 사람이 입을 수 있는 상태면 가까운 지자체 또는 민간 재활용사업자가 비치한 폐의류 전용수거함에 배출합니다.<br /><br />
        찢어졌거나 오염이 심해서 다른 사람이 입을 수 없는 상태면 일반쓰레기(종량제봉투)로 버려야합니다.<br /><br />
        많은 양의 옷을 처분해야 하거나 그냥 버리는 것이 아깝다면 의류 수거 업체에 연락해서 무게에 따라 보상을 받을 수도 있습니다.<br /><br />
        또는 각종 공익 단체나 기관에 옷을 기부해서 국내 소외계층이나 해외 빈곤 지역에 직접적인 도움을 주는 방법도 있습니다.<br /><br /></p>,
    cardboard: <p><big style={{ fontSize: '30px' }}>해당 사진은 종이류로 보여집니다.</big><br /><br />
        물기에 젖지 않도록 하고, 반듯하게 펴서 차곡차곡 쌓은 후 흩날리지 않도록 끈 등으로 묶어서 배출해야 합니다.<br /><br />
        종이박스, 골판지,책, 잡지, 공책, 노트 등 스프링 등 종이류와 다른 재질은 부속 재질에 따라 분리배출하거나 종량제봉투 등으로 배출해야 하지만<br /><br />
        비닐 코팅 종이(광고지, 치킨 속포장재 등), 금박·은박지, 벽지, 자석전단지, 이물질을 제거하기 어려운 경우 종량제봉투로 배출해야 합니다.<br /><br /></p>,
    battery: <p><big style={{ fontSize: '30px' }}>해당 사진은 배터리류로 보여집니다.</big><br /><br />
        알카리 건전지 (AA, AAA, 9V 등)는 사용 후, 알카리 건전지는 일반 가정에서 폐기물로 처리될 수 있습니다.<br /><br />
        그러나 재활용이 가능하므로, 가능하다면 지역의 재활용 센터나 배터리 수거함에 해당 배터리를 분리하여 버리는 것이 좋습니다.<br /><br />
        리튬 이온 배터리 (스마트폰, 노트북, 전동공구 등)는 재활용이 가능하나,<br /><br />
        화재·폭발 위험성이 있어 전용수거함에 바로 배출하지 않고 구청 담당부서에 문의하거나 동주민센터 담당자에게 직접 배출해야 합니다.<br /><br /></p>,
    shoes: <p><big style={{ fontSize: '30px' }}>해당 사진은 의류로 보여집니다.</big><br /><br />
        옷이 비교적 깨끗하고 다른 사람이 입을 수 있는 상태면 가까운 지자체 또는 민간 재활용사업자가 비치한 폐의류 전용수거함에 배출합니다.<br /><br />
        찢어졌거나 오염이 심해서 다른 사람이 입을 수 없는 상태면 일반쓰레기(종량제봉투)로 버려야합니다.<br /><br />
        많은 양의 옷을 처분해야 하거나 그냥 버리는 것이 아깝다면 의류 수거 업체에 연락해서 무게에 따라 보상을 받을 수도 있습니다.<br /><br />
        또는 각종 공익 단체나 기관에 옷을 기부해서 국내 소외계층이나 해외 빈곤 지역에 직접적인 도움을 주는 방법도 있습니다.<br /><br /></p>,
}



const UploadPage = ({ setter, setBoundboxSize, curruntView, accessToken }) => {
    const selectFile = useRef("")
    const uploadedImg = useRef()
    const canvasref = useRef()

    const [modelRes, setModelRes] = useState({})
    const [drawnImage, setDrawnImgae] = useState({})
    const [imgPath, setImgPath] = useState("/de.png")
    const [detectionCount, setDeCount] = useState({ count: 0, display: 'none' })

    const { modalactive, setmodalactive } = useContext(AppContext2)

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
        try {
            img.src = URL.createObjectURL(i)
        } catch { return }
        setImgPath(img.src)
        setmodalactive('flex')

        let formData = new FormData()
        formData.append('image', i)
        try {
            const imgBoundboxResponse = await axios.post('/uploadImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(accessToken !== 'notting' && { Authorization: `Bearer ${accessToken}` })
                }
            })
            setModelRes(imgBoundboxResponse.data)
            setDeCount({ count: imgBoundboxResponse.data.score.length, display: 'block' })
            // ymin, xmin, ymax, xmax
            setmodalactive('none')
            //URL.revokeObjectURL(img.src)
        } catch (e) {
            console.log(e)
        }
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
            setDrawnImgae({ x, y, w: scaledWidth, h: scaledHeight })
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
        setBoundboxSize({
            imgPath,
            xOffset: img.width * points[1],
            yOffset: img.height * points[0],
            boxWidth: img.width * points[3] - img.width * points[1],
            boxHeight: img.height * points[2] - img.height * points[0]
        })
        const textWidth = context.measureText(text + ' ' + score.toFixed(2)).width
        context.fillStyle = 'white'
        context.fillRect(xOffset + 2, yOffset + 2, textWidth + 5, 25)
        context.font = '20px Arial'
        context.fillStyle = 'blue'
        context.fillText(text + ' ' + score.toFixed(2), xOffset + 3, yOffset + 20)

    }, [boundboxIdx])

    return (<C>
        <input onChange={handleChange} type="file" accept=".jpg, .jpeg, .png" style={{ display: "none" }} ref={selectFile} />
        <OptionsContainer>
            <DetectionComment display={detectionCount.display}>A total of {detectionCount.count} objects were detected</DetectionComment>
            <img style={{ cursor: 'pointer', marginTop: 22, marginRight: 25, userSelect: 'none' }} width={30} height={50} src={'/l.svg'} alt='sorry' onClick={() => { dispatch({ type: 'DECREMENT' }) }} />
            <img style={{ cursor: 'pointer', marginTop: 22, marginLeft: 20, marginRight: 15, userSelect: 'none' }} width={30} height={50} src={'/r.svg'} alt='sorry' onClick={() => { dispatch({ type: 'INCREMENT' }) }} />
            <img style={{ cursor: 'pointer', marginTop: 15, marginLeft: 12, marginRight: 15, userSelect: 'none' }} width={70} height={70} src={'/feedback.svg'} alt='sorry' onClick={() => { setter(true) }} />
            <img style={{ cursor: 'pointer', margin: '10px', userSelect: 'none' }} width={70} height={70} src={'/upload-image.svg'} alt='sorry' onClick={() => selectFile.current.click()} />
        </OptionsContainer>
        <canvas ref={canvasref} style={{ objectFit: 'contain', maxHeight: 620 }} />
        <img src={imgPath} ref={uploadedImg} style={{ display: 'none' }} alt='sorry' />
        {curruntView === '0' & boundboxIdx !== -1 ? <CommentContainer>
            {emitSolutions[modelRes.classNames[boundboxIdx]]}
        </CommentContainer> : ''}
    </C>)
}
export default UploadPage
// 통계를 일별 월별 각각 카테고리마다 분류된 수치 등... 분류된 수치만큼 포인트를 주는식으로 분리 유도?