import { useEffect, useState } from "react";
import dayjs from "dayjs"
import { authHeader } from "../../services/AuthServices";
import axios from "axios";
import NotificationServices from "../../services/notificationServices/NotificationServices";
import { Divider, Modal, RingProgress, ScrollArea, Table } from "@mantine/core";
import { numberWithCommas, setBadge } from "../../services/Utilities";
import classes from './Home.module.css'
import LineChart from "../../components/charts/LineChart";
import { PieChart } from "../../components/charts/PieChart";
const Home = () => {
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
        }
    ]
    const [data, setData] = useState([])
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [modalData, setModalData] = useState({})
    useEffect(() => {
        const date = new Date()

        const requestBody = {
            f13: `${dayjs(date).get('month') + 1}${dayjs(date).get('date')}`
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
                // setLoading(false)
            })
    }, [])

    const handleShowDetailTransaction = (e, item) => {
        setShowDetailModal(true)
        setModalData(item)
    }

    const rows = fake.map((element, index) => (
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
    return (
        <div className='flex flex-row xs:flex-col xl:flex-row w-full gap-2 xs:gap-2 lg:gap-2 justify-start items-center'>
            <div className="flex flex-col w-1/3 xs:w-full xl:w-1/3 h-full gap-2">
                {/* left */}
                <div className="flex flex-1 flex-col w-full justify-center items-start gap-2">
                    <div className="flex flex-1 flex-col w-full bg-white p-2">
                        <Divider my="xs" variant="dashed" label="Tỉ lệ giao dịch tháng 10/2023" labelPosition="left" className="flex w-full" classNames={{ label: classes.label }} />
                        <div className="flex flex-1 flex-row w-full max-w-full">
                            <div className="flex flex-col flex-1 items-center justify-center">
                                <RingProgress
                                    size={110}
                                    sections={[{ value: 70, color: 'teal' }]}
                                    label={
                                        <p className="flex text-xl text-green-500 font-semibold justify-center items-center">70%</p>

                                    }
                                />
                                <p className="text-xs">Thành công</p>
                            </div>
                            <div className="flex flex-col flex-1 bg-white items-center justify-center">
                                <RingProgress
                                    size={110}
                                    sections={[{ value: 10, color: 'orange' }]}
                                    label={
                                        <p className="flex text-xl text-orange-500 font-semibold justify-center items-center">10%</p>
                                    }
                                />
                                <p className="text-xs">Đang xử lý</p>
                            </div>
                            <div className="flex flex-col flex-1 bg-white items-center justify-center">
                                <RingProgress
                                    size={110}
                                    sections={[{ value: 20, color: 'red' }]}
                                    label={
                                        <p className="flex text-xl text-red-500 font-semibold justify-center items-center">20%</p>
                                    }
                                />
                                <p className="text-xs">Không thành công</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 w-full bg-white p-2 justify-center items-center">
                    {/* pie chart */}
                    <PieChart />
                </div>
            </div>
            <div className="flex flex-col w-2/3 xs:w-full xl:w-2/3 h-full gap-2">
                {/* cot phai */}
                <div className="relative flex flex-1 w-full bg-white p-2 justify-center items-center">
                    {/* line chart */}
                    <LineChart />
                </div>
                <div className="flex flex-col flex-1 w-full bg-white p-2 justify-center items-center">
                    {/* table */}
                    <Divider my="xs" variant="dashed" label="Giao dịch gần nhất" labelPosition="left" className="flex w-full" classNames={{ label: classes.label }} />
                    <ScrollArea
                        offsetScrollbars
                        scrollbarSize={8}
                        className="h-[18rem] xs:h-full xl:h-[18rem] w-full"
                        scrollHideDelay={0}
                    >
                        <Table striped highlightOnHover>
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
                    </ScrollArea>

                </div>

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
                            <p className="flex flex-1 justify-start items-center text-sm">{setBadge(modalData.ben_respcode)}</p>
                        </div>
                        <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Nội dung</p>
                            <p className="flex flex-1 justify-start items-center text-sm">{modalData.trans_content}</p>
                        </div>
                    </div>
                </ScrollArea>


            </Modal>

        </div>
    );
}

export default Home