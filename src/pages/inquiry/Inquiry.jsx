import { useState } from "react"
import { TextInput, Accordion, Tooltip, Divider, ScrollArea, ActionIcon } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import classes from './Inquiry.module.css'
import dayjs from "dayjs"
import NotificationServices from "../../services/notificationServices/NotificationServices"
import { authHeader } from "../../services/AuthServices"
import axios from "axios"
import { numberWithCommas, setBadge } from "../../services/Utilities"
import { IconDiscountCheck, IconLoader, IconExclamationCircle, IconSearch } from "@tabler/icons-react"

const Inquiry = () => {
    const fake = [
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:42:50",
            "amount": "10000",
            "trace_no": "145273",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        },
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:42:50",
            "amount": "20000",
            "trace_no": "160135",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        },
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:44:38",
            "amount": "30000",
            "trace_no": "468845",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        },
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:42:50",
            "amount": "10000",
            "trace_no": "145273",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        },
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:42:50",
            "amount": "20000",
            "trace_no": "160135",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        },
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:44:38",
            "amount": "30000",
            "trace_no": "468845",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        },
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:42:50",
            "amount": "10000",
            "trace_no": "145273",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        },
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:42:50",
            "amount": "20000",
            "trace_no": "160135",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        },
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:44:38",
            "amount": "30000",
            "trace_no": "468845",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        },
        {
            "ben_id": "970406",
            "from_account": "111222",
            "to_account": "6666688884",
            "local_date": "1017",
            "settlementDate": "1017",
            "local_time": "17/10/2023 15:42:50",
            "amount": "10000",
            "trace_no": "145273",
            "ref_code": "3290970412AgIIrG",
            "respcode": "00",
            "ben_respcode": "00",
            "f60": "04",
            "proc_code": "912020",
            "trans_content": "huynt chuyen khoan",
            "f120": "NGUYEN VAN B"
        }
    ]
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

    const handleSearch = () => {
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
                <div className="flex flex-row xs:flex-col lg:flex-row w-full h-14 xs:h-28 lg:h-14 justify-center items-center gap-2 p-2">
                    <div className="flex h-full xs:w-full lg:w-11/12 gap-2">
                        <TextInput
                            placeholder="Mã giao dịch"
                            size="md"
                            className="flex flex-1 justify-start items-center"
                            value={orderId}
                            onChange={handleChangeOrderId}
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper
                            }}
                        />
                        <DatePickerInput
                            valueFormat="DD/MM/YYYY"
                            value={date}
                            onChange={handleChangeDate}
                            size="md"
                            className="flex flex-1 justify-start items-center"
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper
                            }}
                        />
                    </div>
                    <div className="flex h-full xs:w-full lg:w-1/12 items-center justify-center  hover:cursor-pointer" onClick={handleSearch}>
                        {/* {loading ? <Loader size={20} /> : <IconSearch size={20} />} */}
                        <ActionIcon
                            size="xl"
                            variant="filled"
                            color="violet"
                            className="w-full border-none rounded-none"

                        >
                            {loading ? <IconLoader /> : <IconSearch />}
                        </ActionIcon>
                    </div>
                </div>
                <div className="flex flex-col w-full justify-center items-start gap-2 p-2">
                    <p className="text-white text-sm m-0">* Mã giao dịch bao gồm 6 ký tự hoặc để trống.</p>
                    <p className="text-white text-sm m-0">* Trường hợp không nhập mã giao dịch, hệ thống sẽ tìm ra 10 giao dịch gần nhất trong ngày tìm kiếm.</p>
                </div>
            </div>

            <div className="flex flex-col w-full h-full justify-center items-start">
                <ScrollArea
                    // offsetScrollbars
                    scrollbarSize={8}
                    className="h-[28rem] xs:h-full xl:h-[28rem] 3xl:h-[52rem] w-full"
                    scrollHideDelay={0}
                >
                    <Accordion variant="contained" className="flex flex-col w-full h-full">
                        {fake.map((item, index) => (
                            <Accordion.Item value={item.trace_no} className="flex flex-col w-full bg-white" key={item.trace_no}>
                                <Accordion.Control
                                    icon={item.respcode === '00' ? <IconDiscountCheck className=" text-green-500" /> : item.respcode === '68' ? <IconLoader className=" text-yellow-500" /> : <IconExclamationCircle className=" text-red-500" />}>
                                    <div className="flex flex-row w-1/2 xs:w-full lg:w-1/2">
                                        <p className="flex flex-1 justify-start items-center">{`Giao dịch ${data.length > 1 ? index + 1 : ''}`}</p>
                                        <p className="flex flex-1 xs:hidden md:block justify-start items-center">{numberWithCommas(item.amount)}</p>
                                        <p className="flex flex-1 justify-start items-center">{setBadge(item.respcode)}</p>
                                    </div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <div className="flex flex-row xs:flex-col lg:flex-row justify-center items-start w-full gap-2">
                                        {/* cột trái */}
                                        <div className="flex flex-col lg:flex-1 xs:w-full">
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Ngân hàng phát lệnh</p>
                                                    <p className="flex flex-1 justify-start items-center">Vina Bank</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Tài khoản gửi</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.from_account}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Hình thức chuyển khoản</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.f60 === '99' ? 'Mã QR' : 'Thông thường'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Ngày giao dịch</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.local_time}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Trạng thái tại Napas</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.respcode ? setBadge(item.respcode) : 'Không phản hồi'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Số tiền giao dịch</p>
                                                    <p className="flex flex-1 justify-start items-center">{numberWithCommas(item.amount)}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Mã giao dịch</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.ref_code}</p>
                                                </div>
                                            </div>

                                        </div>

                                        <Divider size="xs" variant="dashed" orientation="vertical" className="xs:hidden lg:block" />
                                        {/* cột phải */}
                                        <div className="flex flex-col xs:flex lg:flex-1 xs:w-full">
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Ngân hàng nhận lệnh</p>
                                                    <p className="flex flex-1 justify-start items-center">Đông Á Bank</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Tài khoản nhận</p>
                                                    <Tooltip label="Tài khoản đã xác minh" color="#0ea5e9">
                                                        <p className="flex flex-1 justify-start items-center cursor-pointer hover:text-sky-500">{item.to_account} {item.f60 === '99' && <IconDiscountCheck className="flex fill-sky-500 text-white items-start justify-center" />}</p>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Tên người nhận</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.f120}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Ngày quyết toán</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.local_time.split(' ')[0]}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Trạng thái tại NHNL</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.ben_respcode ? setBadge(item.ben_respcode) : 'Không phản hồi'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Nội dung chuyển tiền</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.trans_content}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-row justify-start items-center w-full h-full gap-2">
                                                <div className="flex flex-row flex-grow">
                                                    <p className="flex flex-1 font-semibold  justify-start items-center">Số trace</p>
                                                    <p className="flex flex-1 justify-start items-center">{item.trace_no}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </ScrollArea>
            </div>
        </div>
    )
}

export default Inquiry