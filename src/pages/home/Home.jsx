import { useEffect, useState } from "react";
import dayjs from "dayjs"
import { authHeader } from "../../services/AuthServices";
import axios from "axios";
import NotificationServices from "../../services/notificationServices/NotificationServices";
import { Divider, Fieldset, Modal, Table } from "@mantine/core";
import { numberWithCommas, setBadge } from "../../services/Utilities";
import classes from './Home.module.css'
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

    const rows = data.map((element, index) => (
        <Table.Tr key={element.trace_no}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td className="flex text-sky-500 hover:text-sky-700 hover:cursor-pointer" onClick={(e) => handleShowDetailTransaction(e, element)}>{element.ref_code}</Table.Td>
            <Table.Td>{setBadge(element.respcode)}</Table.Td>
            <Table.Td>Vinabank</Table.Td>
            <Table.Td>Đông Á Bank</Table.Td>
            <Table.Td>{numberWithCommas(element.amount)}</Table.Td>
            <Table.Td>{element.local_time}</Table.Td>
        </Table.Tr>
    ));
    return (
        <div className='flex flex-col w-full gap-4 xs:gap-4 lg:gap-4 justify-start items-center'>
            <div className='flex flex-row xs:flex-col lg:flex-row w-full gap-4 h-[10rem] xs:h-[20rem] lg:h-[10rem]'>
                <div className="flex flex-1 w-full h-full bg-cyan-500">
                    div 1
                </div>
                <div className="flex flex-1 w-full h-full bg-cyan-500">
                    div 2
                </div>
            </div>
            <div className='flex flex-col flex-grow xs:flex-col lg:flex-col w-full bg-white p-2'>
                <Divider my="xs" variant="dashed" label="Giao dịch gần nhất" labelPosition="left" className="flex w-full" classNames={{ label: classes.label }} />
                <Table.ScrollContainer minWidth={500} className="flex w-full">
                    <Table striped highlightOnHover >
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
                </Table.ScrollContainer>
            </div>
            <Modal opened={showDetailModal} onClose={setShowDetailModal} title="Chi tiết GD">
                <div className="flex flex-col w-full items-center justify-start">
                    <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Số trace</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{modalData.trace_no}</p>
                    </div>
                    <div className="flex flex-row w-full gap-2 bg-slate-100 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Mã giao dịch</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{modalData.ref_code}</p>
                    </div>

                    <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Trạng thái giao dịch tại Napas</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{setBadge(modalData.respcode)}</p>
                    </div>

                    <div className="flex flex-row w-full gap-2 bg-slate-100 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Ngân hàng chuyển</p>
                        <p className="flex flex-1 justify-start items-center text-sm">Vinabank</p>
                    </div>

                    <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Tài khoản chuyển</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{modalData.from_account}</p>
                    </div>

                    <div className="flex flex-row w-full gap-2 bg-slate-100 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Ngân hàng nhận</p>
                        <p className="flex flex-1 justify-start items-center text-sm">Đông Á Bank</p>
                    </div>

                    <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Tài khoản nhận</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{modalData.to_account}</p>
                    </div>

                    <div className="flex flex-row w-full gap-2 bg-slate-100 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Người nhận</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{modalData.f120}</p>
                    </div>

                    <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Số tiền</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{numberWithCommas(modalData.amount ?? 0)}</p>
                    </div>

                    <div className="flex flex-row w-full gap-2 bg-slate-100 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Thời gian GD</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{modalData.local_time}</p>
                    </div>

                    <div className="flex flex-row w-full gap-2 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Trạng thái giao dịch tại NHTH</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{setBadge(modalData.ben_respcode)}</p>
                    </div>
                    <div className="flex flex-row w-full gap-2 bg-slate-100 hover:bg-slate-200 hover:cursor-pointer">
                        <p className="flex flex-1 justify-start items-center font-semibold capitalize text-sm">Nội dung</p>
                        <p className="flex flex-1 justify-start items-center text-sm">{modalData.trans_content}</p>
                    </div>
                </div>

            </Modal>
        </div>
    );
}

export default Home