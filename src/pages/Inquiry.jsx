import { useState } from "react"
import { Button, TextInput, Badge, Loader, Accordion, Tooltip } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import dayjs from "dayjs"
import NotificationServices from "../services/notificationServices/NotificationServices"
import { authHeader } from "../services/AuthServices"
import axios from "axios"
import { numberWithCommas } from "../services/Utilities"
import { IconNorthStar, IconDiscountCheck, IconLoader, IconX } from "@tabler/icons-react"

const Inquiry = () => {
    const [date, setDate] = useState(new Date());
    const [orderId, setOrderId] = useState('')
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const handleChangeDate = (e) => {
        setDate(e)
    }
    const handleChangeOrderId = (e) => {
        setOrderId(e.target.value)
    }

    const setBadge = (status) => {
        return (
            <Badge
                size="md"
                color={status === '00' ? 'green' : status === '68' ? 'yellow' : 'red'}
            >
                {status === '00' ? 'Thành công' : status === '68' ? 'Đang xử lý' : 'Thất bại'}
            </Badge>
        )
    }

    const handleSearch = () => {
        if (!orderId) {
            NotificationServices.warning(`Không được để trống mã giao dịch`)
            return
        }
        setLoading(true)
        const requestBody = {
            f13: `${dayjs(date).get('month') + 1}${dayjs(date).get('date')}`,
            f63: orderId
        }

        axios.post('/bankdemo/api/payment/tranStatus', requestBody, { headers: authHeader() })
            .then(res => {
                setData(res.data.payload)
                if (res.data.payload.length === 0) {
                    NotificationServices.info(`Không tìm thấy giao dịch`)
                }

            })
            .catch(err => {
                const { status, statusText } = err.response
                NotificationServices.error(`${status}: ${statusText}`)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className="flex flex-col w-full h-full gap-10 xs:gap-5 md:gap-10">
            <div className="flex flex-col w-full h-full bg-gradient-to-r from-[#7474BF] to-[#348AC7] justify-start items-center shadow-sm">
                <div className="flex flex-row w-full h-14 justify-center items-center gap-2">
                    <div className="flex h-full">
                        <TextInput
                            placeholder="Mã giao dịch"
                            size="md"
                            className="flex justify-start items-center"
                            value={orderId}
                            onChange={handleChangeOrderId}
                        />
                    </div>
                    <div className="flex h-full">
                        <DatePickerInput
                            valueFormat="DD/MM/YYYY"
                            value={date}
                            onChange={handleChangeDate}
                            size="md"
                            className="flex justify-start items-center"
                        />
                    </div>
                    <div className="flex h-full items-center">
                        <Button variant='filled' className='flex justify-start items-center' size="md" color="orange" rightSection={loading && <Loader size={20} color="white" />} onClick={handleSearch} >Tìm kiếm</Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full h-full justify-center items-start">
                <Accordion variant="contained" className="flex flex-col w-full h-full">
                    {data.map((item, index) => (
                        <Accordion.Item value={item.trace_no} className="flex flex-col w-full" key={item.trace_no}>
                            <Accordion.Control
                                icon={item.respcode === '00' ? <IconDiscountCheck className=" text-green-500" /> : item.respcode === '68' ? <IconLoader className=" text-yellow-500" /> : <IconX className=" text-red-500" />}>
                                <div className="flex flex-row w-1/2 xs:w-full lg:w-1/2">
                                    <p className="flex flex-1 justify-start items-center">{`Giao dịch ${index + 1}`}</p>
                                    <p className="flex flex-1 xs:hidden md:block justify-start items-center">{numberWithCommas(item.amount)}</p>
                                    <p className="flex flex-1 justify-start items-center">{setBadge(item.respcode)}</p>
                                </div>
                            </Accordion.Control>

                            <Accordion.Panel>
                                <div className="flex flex-row xs:flex-col lg:flex-row justify-center items-start w-full">
                                    {/* cột trái */}
                                    <div className="flex flex-col lg:flex-1 xs:w-full">
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Ngân hàng phát lệnh</p>
                                                <p className="flex flex-1 justify-start items-center">Vina Bank</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Tài khoản gửi</p>
                                                <p className="flex flex-1 justify-start items-center">{item.from_account}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Tên người gửi</p>
                                                <p className="flex flex-1 justify-start items-center">VNB</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Ngày giao dịch</p>
                                                <p className="flex flex-1 justify-start items-center">{item.local_time}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Trạng thái tại Napas</p>
                                                <p className="flex flex-1 justify-start items-center">{setBadge(item.respcode)}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Số tiền giao dịch</p>
                                                <p className="flex flex-1 justify-start items-center">{numberWithCommas(item.amount)}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Mã giao dịch</p>
                                                <p className="flex flex-1 justify-start items-center">{item.ref_code}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Hình thức chuyển khoản</p>
                                                <p className="flex flex-1 justify-start items-center">{item.f60 === '99' ? 'Mã QR' : 'Thông thường'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* cột phải */}
                                    <div className="flex flex-col xs:flex lg:flex-1 xs:w-full">
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Ngân hàng nhận lệnh</p>
                                                <p className="flex flex-1 justify-start items-center">Đông Á Bank</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Tài khoản nhận</p>
                                                <Tooltip label="Tài khoản đã xác minh" color="#0ea5e9">
                                                    <p className="flex flex-1 justify-start items-center cursor-pointer hover:text-sky-500">{item.to_account} {item.f60 === '99' && <IconDiscountCheck className="flex fill-sky-500 text-white items-start justify-center" />}</p>
                                                </Tooltip>

                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Tên người nhận</p>
                                                <p className="flex flex-1 justify-start items-center">{item.f120}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Ngày quyết toán</p>
                                                <p className="flex flex-1 justify-start items-center">{item.local_time.split(' ')[0]}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Trạng thái tại NHNL</p>
                                                <p className="flex flex-1 justify-start items-center">{setBadge(item.ben_respcode)}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Nội dung chuyển tiền</p>
                                                <p className="flex flex-1 justify-start items-center">{item.trans_content}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                            <div className="flex">
                                                <IconNorthStar className="flex text-indigo-400 w-5 h-5 justify-center items-start" />
                                            </div>
                                            <div className="flex flex-row flex-grow">
                                                <p className="flex flex-1 font-semibold text-slate-400 justify-start items-center">Số trace</p>
                                                <p className="flex flex-1 justify-start items-center">{item.trace_no}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default Inquiry