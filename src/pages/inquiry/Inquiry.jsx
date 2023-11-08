import { useEffect, useState } from "react"
import { TextInput, Accordion, Tooltip, Divider, ScrollArea, ActionIcon, Switch, Table, Modal } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import classes from './Inquiry.module.css'
import dayjs from "dayjs"
import NotificationServices from "../../services/notificationServices/NotificationServices"
import { authHeader } from "../../services/AuthServices"
import axios from "axios"
import { numberWithCommas, setBadge } from "../../services/Utilities"
import { IconDiscountCheck, IconLoader, IconExclamationCircle, IconSearch } from "@tabler/icons-react"

const Inquiry = () => {
    const [tableMode, setTableMode] = useState(true)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [modalData, setModalData] = useState({})
    const [date, setDate] = useState(new Date());
    const [orderId, setOrderId] = useState('')
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        // setData(fake)
        setLoading(true)
        const dateS = `${dayjs(date).get('date')}`.length === 1 ? `0${dayjs(date).get('date')}` : `${dayjs(date).get('date')}`
        const monthS = `${dayjs(date).get('month') + 1}`.length === 1 ? `0${dayjs(date).get('month') + 1}` : `${dayjs(date).get('month') + 1}`
        const requestBody = {
            f13: `${monthS}${dateS}`
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
    }, [])

    const handleChangeDate = (e) => {
        setDate(e)
    }
    const handleChangeOrderId = (e) => {
        setOrderId(e.target.value)
    }

    const rows = data.map((element, index) => (
        <Table.Tr key={element.trace_no}>
            <Table.Td className="text-sm">{index + 1}</Table.Td>
            <Table.Td className=" h-full text-sky-500 hover:text-sky-700 hover:cursor-pointer text-sm" onClick={(e) => handleShowDetailTransaction(e, element)}>{element.ref_code}</Table.Td>
            <Table.Td className="text-sm">{setBadge(element.respcode)}</Table.Td>
            <Table.Td className="text-sm">Vinabank</Table.Td>
            <Table.Td className="text-sm">Đông Á Bank</Table.Td>
            <Table.Td className="text-sm">{numberWithCommas(element.amount)}</Table.Td>
            <Table.Td className="text-sm">{element.local_time}</Table.Td>
        </Table.Tr>
    ));

    const handleShowDetailTransaction = (e, item) => {
        setShowDetailModal(true)
        setModalData(item)
    }

    const handleSearch = () => {
        setLoading(true)
        const dateS = `${dayjs(date).get('date')}`.length === 1 ? `0${dayjs(date).get('date')}` : `${dayjs(date).get('date')}`
        const monthS = `${dayjs(date).get('month') + 1}`.length === 1 ? `0${dayjs(date).get('month') + 1}` : `${dayjs(date).get('month') + 1}`
        const requestBody = {
            f13: `${monthS}${dateS}`,
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
                    <Switch
                        size="sm"
                        onLabel="ON"
                        offLabel="OFF"
                        label={<p className="text-white text-sm m-0 hover:cursor-pointer">Xem dạng bảng</p>}
                        color="teal"
                        checked={tableMode} onChange={(event) => setTableMode(event.currentTarget.checked)}
                        classNames={{
                            track: classes.track
                        }}
                    />
                    <p className="text-white text-sm m-0">* Mã giao dịch bao gồm 6 ký tự hoặc để trống.</p>
                    <p className="text-white text-sm m-0">* Trường hợp không nhập mã giao dịch, hệ thống sẽ tìm ra 10 giao dịch gần nhất trong ngày tìm kiếm.</p>
                </div>
            </div>

            <div className="flex flex-col w-full h-full max-w-full overflow-x-auto justify-center items-start">
                {
                    !tableMode &&
                    <Accordion variant="contained" className="flex flex-col w-full h-full">
                        {data.map((item, index) => (
                            <Accordion.Item value={item.trace_no} className="flex flex-col w-full bg-white" key={item.trace_no}>
                                <Accordion.Control
                                    icon={item.respcode === '00' ? <IconDiscountCheck className=" text-green-500" /> : item.respcode === '68' ? <IconLoader className=" text-yellow-500" /> : <IconExclamationCircle className=" text-red-500" />}>
                                    <div className="flex flex-row w-1/2 xs:w-full lg:w-1/2">
                                        <p className="flex flex-1 justify-start items-center">{`Giao dịch ${data.length > 1 ? index + 1 : ''}`}</p>
                                        <p className="flex flex-1 xs:hidden md:block justify-start items-center">{item.ref_code}</p>
                                        <p className="flex flex-1 xs:hidden md:block justify-start items-center">{numberWithCommas(item.amount)}</p>
                                        <p className="flex flex-1 justify-start items-center">{setBadge(item.respcode)}</p>
                                        <p className="flex flex-1 justify-start items-center">{setBadge(item.local_time)}</p>
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
                                                    <p className="flex flex-1 justify-start items-center">{item.ben_respcode === '63' ? '' : setBadge(item.ben_respcode)}</p>
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
                }
                {
                    tableMode &&
                    <Table striped highlightOnHover className=" bg-white w-full">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Mã giao dịch</Table.Th>
                                <Table.Th>Trạng thái giao dịch</Table.Th>
                                <Table.Th>Ngân hàng chuyển</Table.Th>
                                <Table.Th>Ngân hàng nhận</Table.Th>
                                <Table.Th>Số tiền</Table.Th>
                                <Table.Th>Thời gian GD</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                }
            </div>

            <Modal opened={showDetailModal} onClose={setShowDetailModal} title="Chi tiết giao dịch">
                <ScrollArea
                    offsetScrollbars
                    scrollbarSize={8}
                    className="h-[30rem] xs:h-full xl:h-[30rem]"
                    scrollHideDelay={0}
                >
                    <div className="flex flex-col w-full items-center justify-start">
                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Số trace</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{modalData.trace_no}</p>
                        </div>
                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Mã giao dịch</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{modalData.ref_code}</p>
                        </div>

                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Trạng thái giao dịch tại Napas</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{setBadge(modalData.respcode)}</p>
                        </div>

                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Ngân hàng chuyển</p>
                            <p className="flex flex-1 justify-start items-center text-sm">Vinabank</p>
                        </div>

                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Tài khoản chuyển</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{modalData.from_account}</p>
                        </div>

                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Ngân hàng nhận</p>
                            <p className="flex flex-1 justify-start items-center text-sm">Đông Á Bank</p>
                        </div>

                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Tài khoản nhận</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{modalData.to_account}</p>
                        </div>

                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Người nhận</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{modalData.f120}</p>
                        </div>

                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Số tiền</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{numberWithCommas(modalData.amount ?? 0)}</p>
                        </div>

                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Thời gian GD</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{modalData.local_time}</p>
                        </div>

                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Trạng thái giao dịch tại NHTH</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{modalData.ben_respcode === '63' ? '' : setBadge(modalData.ben_respcode)}</p>
                        </div>
                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Nội dung</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{modalData.trans_content}</p>
                        </div>
                    </div>
                </ScrollArea>
            </Modal>
        </div>
    )
}

export default Inquiry