import React, { useRef, useState, useContext } from 'react';
import styled from 'styled-components'
import './login.style.css'
import axios from 'axios';
import { AccessTokenContext } from './App';
import { Cookies, useCookies } from 'react-cookie';

const C = styled.div`
    display: flex;
    width: 33%;
    margin: 0;
    padding: 0;
    justify-content: end;
    align-items: center;
`
const ErrorSpan = styled.span`
    color: red;
    display: ${(props) => props.display};
`

const Login = () => {
    const [state, setState] = React.useState('container')
    const loginEmail = useRef(null)
    const loginPassword = useRef(null)
    const signupEmail = useRef(null)
    const signupPassword = useRef(null)
    const signupPasswordRe = useRef(null)
    const [emailErrorMes, setEmailErrorMsg] = useState({ display: 'none', msg: "" })
    const [pwErrorMes, setPwErrorMsg] = useState({ display: 'none', msg: "" })
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const cookies = new Cookies()
    const [cookie, setCookie, rmCookie] = useCookies(['refreshToken']);

    const signup = async () => {
        const email = signupEmail.current.value
        const pw = signupPassword.current.value
        const pwre = signupPasswordRe.current.value
        const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
        setEmailErrorMsg({ display: 'none', msg: " " })
        setPwErrorMsg({ display: 'none', msg: " " })

        if (!regEmail.test(email))
            return setEmailErrorMsg({ display: 'block', msg: '올바른 이메일 형식이 아닙니다.' })
        else if (10 > pw.length || 32 < pw.length)
            return setPwErrorMsg({ display: 'block', msg: '비밀번호는 10 ~ 32자 사이여야 합니다.' })
        else if (pw !== pwre)
            return setPwErrorMsg({ display: 'block', msg: '비밀번호가 서로 일치하지 않습니다.' })

        let formData = new FormData()
        formData.append('email', email)
        formData.append('password', pw)
        const res = await axios.post('/signup', formData)
        if (res.data === 'email_overlap')
            return setEmailErrorMsg({ display: 'block', msg: '이메일이 중복 되었습니다.' })
        alert('sign up success!')
        window.location.reload()
    }

    const login = async () => {
        let formData = new FormData()
        formData.append('email', loginEmail.current.value)
        formData.append('password', loginPassword.current.value)
        const res = await axios.post('/login', formData)
        if (res.data.res === 'login_success') {
            setAccessToken(res.data.access_token)
            cookies.set('refreshToken', res.data.refresh_token, {
                path: '/',
                secure: false
            })
            window.location.reload()
        }
        else
            alert(res.data.res)
    }

    const logout = () => {
        setAccessToken({ access_token: 'notting' })
        rmCookie('refreshToken')
        window.location.reload()
    }

    if (accessToken.access_token !== 'notting') {
        return (
            <C>
                <div className={state}>
                    <div className="forms">
                        <div className="form login">
                            <div className="input-field">
                                <input style={{ border: "none" }} onClick={() => { logout() }} value="Log out" className="submit-button" />
                            </div>
                        </div>
                    </div>
                </div>
            </C>
        )
    }
    return (
        <C>
            <div className={state}>
                <div className="forms">
                    <div className="form login">
                        <span className="title">Log in</span>
                        <form >
                            <div className="input-field">
                                <input ref={loginEmail} type="text" placeholder="Enter your email" required onKeyDown={(e) => { if (e.key === 'Enter') login() }} />
                            </div>
                            <div className="input-field">
                                <input ref={loginPassword} autoComplete='on' type="password" placeholder="Enter your password" required onKeyDown={(e) => { if (e.key === 'Enter') login() }} />
                            </div>
                            <div className="select-field">
                                <span onClick={() => { setState('container active') }}>not a member?</span>
                            </div>
                            <div className="input-field">
                                <input style={{ border: "none", userSelect: 'none' }} onClick={() => { login() }} value="Log in" className="submit-button" />
                            </div>
                            <div style={{ textAlign: 'center', marginTop: 17, marginBottom: 13, color: 'black' }}>
                                또는 다음으로 로그인
                            </div>
                            <div className="order-login-field">
                                <img width={40} height={40} src={'/kakaotalk.svg'} className='order-login' alt='sorry' />
                                <img width={40} height={40} src={'/google.svg'} className='order-login' alt='sorry' />
                                <img width={40} height={40} src={'/facebook.svg'} className='order-login' alt='sorry' />
                            </div>
                        </form>
                    </div>

                    <div className="form signup">
                        <span className="title">Sign up</span>
                        <form method='post'>
                            <div className="input-field">
                                <input ref={signupEmail} type="text" placeholder="Enter your email" required />
                                <ErrorSpan display={emailErrorMes.display} >{emailErrorMes.msg}</ErrorSpan>
                            </div>
                            <div className="input-field">
                                <input ref={signupPassword} autoComplete='on' type="password" placeholder="Enter your password" required />
                                <ErrorSpan display={pwErrorMes.display}>{pwErrorMes.msg}</ErrorSpan>
                            </div>
                            <div className="input-field">
                                <input ref={signupPasswordRe} name='password' id='password' autoComplete='on' type="password" placeholder="Enter your password" required />
                            </div>
                            <div className="select-field">
                                <span style={{ color: 'black' }} onClick={() => { setState('container') }}>already member?</span>
                            </div>
                            <div className="input-field">
                                <input style={{ border: "none", userSelect: 'none' }} onClick={() => { signup() }} value="submit" className="submit-button" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </C>
    )
}

export default Login