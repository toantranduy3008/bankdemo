{/* react packages */ }
import { useState } from "react"
import { useNavigate } from "react-router-dom"

{/* mantine packages */ }
import { Button, Fieldset, Loader, PasswordInput, TextInput } from "@mantine/core"

{/* other packages & services */ }
import axios from "axios"
import NotificationServices from "../services/notificationServices/NotificationServices"

const Login = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const handleChangeAccount = (e) => {
        setUsername(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleLogin = () => {
        setLoading(true)
        axios.post('/bankdemo/api/auth/signin', {
            username: username,
            password: password
        })
            .then(res => {
                const userSession = JSON.stringify(res.data)
                sessionStorage.setItem('userSession', userSession)
                navigate('/bankdemo/home')
            })
            .catch(err => {
                const { status } = err.response
                NotificationServices.error(`${status}: Đăng nhập không thành công!`)
            })
            .finally(() => setLoading(false))
    }
    return (
        <div className="flex flex-col w-full h-screen bg-[url('/napas-background.jpg')] bg-cover bg-center justify-center items-center">
            <div className="bg-white w-1/3 h-1/2 xs:w-full md:w-1/2 lg:w-1/3 xs:h-3/5 md:h-1/2 flex flex-col justify-start items-center shadow-sm bg-opacity-95 p-4">
                <Fieldset legend="Thông tin đăng nhập" className="flex flex-col w-full h-full justify-center gap-5">
                    <TextInput
                        label="Tài khoản"
                        placeholder="Tài khoản"
                        withAsterisk
                        value={username}
                        onChange={handleChangeAccount}
                    />
                    <PasswordInput
                        placeholder="Mật khẩu"
                        label="Mật khẩu"
                        withAsterisk
                        value={password}
                        onChange={handleChangePassword}
                    />
                    <Button variant='filled' className='mt-2' onClick={handleLogin} rightSection={loading && <Loader size={20} color="white" />}>Đăng nhập</Button>
                </Fieldset>

            </div>
        </div>

    )
}

export default Login