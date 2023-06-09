import React, { useEffect } from 'react'
import styled from 'styled-components'
import Chart from "react-apexcharts";
import axios from 'axios';

const getDateArray = () => {

    const today = new Date()
    const endDate = today.getDate()
    const startDate = endDate - 6

    const arr = []

    for (let i = startDate; i <= endDate; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), i)
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        arr.push(formattedDate)
    }
    return arr
}

const C = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 34%;
    margin: 0;
    margin-left: 3%;
    padding: 0;
    justify-content: start;
    align-items: center;
`
const StyledChart = styled(Chart)`
    margin: 40px;
`
const ChartsContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: start;
    align-items: center;
    height: fit-content;
    width: fit-content;
`
const EmissionsDiv = styled.div`
    font-size: 40px;
`
const state = {
    options: {
        chart: {
            id: "basic-bar"
        },
        xaxis: {
            categories: getDateArray()
        },
        colors: ['#30809d', '#735EC9', '#3E8DF3', '#EB5564', '#F3B344', '#67E09C']
    },
    series: [
        {
            name: "plastic",
            data: [0, 0, 0, 0, 0, 0, 0]
        }, {
            name: "glass",
            data: [0, 0, 0, 0, 0, 0, 0]
        }, {
            name: "cardboard",
            data: [0, 0, 0, 0, 0, 0, 0]
        }, {
            name: "battery",
            data: [0, 0, 0, 0, 0, 0, 0]
        }, {
            name: "clothes",
            data: [0, 0, 0, 0, 0, 0, 0]
        }, {
            name: "metal",
            data: [0, 0, 0, 0, 0, 0, 0]
        }
    ]
}

const dount = {
    options: {
        labels: ['plastic', 'glass', 'cardboard', 'battery', 'clothes', 'metal'],
        colors: ['#30809d', '#735EC9', '#3E8DF3', '#EB5564', '#F3B344', '#67E09C']
    },
    series: [0, 0, 0, 0, 0, 0],
}

let emissions = 0.0

const Statistics = ({ curruntView, accessToken }) => {

    useEffect(() => {
        const f = async function () {
            try {
                const res = await axios.post('/getStatistics', null, {
                    headers: {
                        ...(accessToken !== 'notting' && { Authorization: `Bearer ${accessToken}` })
                    }
                })
                for (let elem of res.data) {
                    const kategoryIdx = dount.options.labels.indexOf(elem.kategory)
                    const dateIdx = state.options.xaxis.categories.indexOf(elem.genDate)
                    dount.series[kategoryIdx]++
                    if (dateIdx !== -1)
                        state.series[kategoryIdx].data[dateIdx]++
                }
                const plasticGram = dount.series[dount.options.labels.indexOf('plastic')] * 20
                const glassGram = dount.series[dount.options.labels.indexOf('glass')] * 200
                const cardboardGram = dount.series[dount.options.labels.indexOf('cardboard')] * 100
                const clothesGram = dount.series[dount.options.labels.indexOf('clothes')] * 200
                emissions = plasticGram * 0.0007292 + plasticGram * 0.0005644 + glassGram * 0.0007292 + glassGram * 0.0005644 + cardboardGram * 0.0007292 + cardboardGram * 0.0005644 + clothesGram * 0.0007292 + clothesGram * 0.0005644
            } catch (e) { console.log(e) }
        }
        f()
    }, [accessToken])
    return <C>
        {curruntView === '-200%' ?
            <><EmissionsDiv>지금까지 총 {emissions.toFixed(5)}g의 온실가스를 감소시키셨습니다</EmissionsDiv>
                <ChartsContainer>
                    <StyledChart options={state.options} series={state.series} type="line" width="550" />
                    <StyledChart options={dount.options} series={dount.series} type="donut" width="550" />
                </ChartsContainer></> : ' '}
    </C>
}

export default Statistics