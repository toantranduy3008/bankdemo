
{/* react packages */ }
import { useState } from "react"
{/* mantine packages */ }
import { NumberInput, ScrollArea, Divider, Badge, TextInput, Loader, Textarea, Button } from "@mantine/core"
import classes from './Demo.module.css'
import { IconTrash, IconUsers, IconCreditCard, IconDatabase, IconCirclePlus, IconDiscountCheck } from "@tabler/icons-react"
import axios from "axios"
import { numberWithCommas } from "../../services/Utilities"
import NotificationServices from "../../services/notificationServices/NotificationServices"
import { getCurrentUser, authHeader } from "../../services/AuthServices"
import { TransactionResultModal } from "../../components/modals/TransactionModals"
import { formatVietnamese } from "../../services/Utilities"

const BatchTransfer = () => {
    const userInfo = getCurrentUser()
    const [listTransaction, setListTransaction] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [toAccount, setToAccount] = useState('')
    const [receiver, setReceiver] = useState('')
    const [refCode, setRefCode] = useState('')
    const [content, setContent] = useState('')
    const [loadingAccount, setLoadingAccount] = useState(false)
    const [modalData, setModalData] = useState({})
    const [loadingTransfer, setLoadingTransfer] = useState(false)
    const [showModalResult, setShowModalResult] = useState(false)
    const handleAddTransaction = () => {
        if (listTransaction.length < 10) {
            setListTransaction(current => [...current, 0])
        }
        else {
            NotificationServices.warning('Chỉ được tạo tối đa 10 giao dịch')
            return;
        }
    }
    const handleChangeAmount = (data, index) => {
        const newListTransaction = [listTransaction[index] = data, ...listTransaction].slice(1)
        setListTransaction(newListTransaction)
        const total = newListTransaction.reduce((x, y) => {
            return parseInt(x) + parseInt(y);
        }, 0)
        setTotalAmount(total)
    }

    const handleChangeToAccount = (e) => {
        setToAccount(e.target.value.trim())
        setReceiver('')
        setRefCode('')
    }

    const handleSearchAccount = () => {
        if (toAccount) {
            setLoadingAccount(true)
            axios.get(`/bankdemo/api/payment/investigatename?creditorAgent=970406&toAccount=${toAccount}`, { headers: authHeader() })
                .then(res => {
                    const { f39, f63, f120 } = res.data
                    if (f39 !== '00') {
                        NotificationServices.error('Không tìm được thông tin tài khoản.')
                        return;
                    }

                    setReceiver(f120)
                    setRefCode(f63)
                })
                .catch(() => {
                    NotificationServices.error('Không tìm được thông tin tài khoản.')
                    return;
                })
                .finally(() => { setLoadingAccount(false) })
        }

    }

    const handleChangeContent = (e) => {
        const content = formatVietnamese(e.target.value)
        setContent(content)
    }

    const handleRemoveTransaction = (e, index) => {
        if (index !== -1) {
            setListTransaction(listTransaction.filter((item, i) => i !== index))
            const total = listTransaction.reduce((x, y) => {
                return parseInt(x) + parseInt(y);
            }, 0)
            setTotalAmount(total)
        }
    }

    const inValidData = () => {
        if (!toAccount || !receiver || !refCode || !content || listTransaction.length === 0 || listTransaction.includes('') || listTransaction.includes(undefined) || listTransaction.includes(0)) {
            return true
        }

        return false
    }

    const handleBatchTransfer = () => {
        if (inValidData()) {
            NotificationServices.warning('Bạn cần nhập đầy đủ thông tin.')
            return
        }

        const requestBody = {
            creditorAgent: '970406',
            toAccount: toAccount.trim(),
            listAmount: listTransaction,
            content: content,
            f120: receiver,
            f63: refCode,
            f60: '04'
        }

        setLoadingTransfer(true)
        axios.post(`/bankdemo/api/payment/fundBatch`, requestBody, { headers: authHeader() })
            .then(res => {
                const { f39, f63 } = res.data
                NotificationServices.info(refCode)
                setToAccount('')
                setReceiver('')
                setRefCode('')
                setContent('')
                setListTransaction([])
                setTotalAmount(0)
                setModalData({
                    status: f39,
                    toAccount: toAccount,
                    refCode: f63,
                    receiver: receiver,
                    amount: totalAmount
                })
                setShowModalResult(!showModalResult)

            })
            .catch(err => {
                const { status, statusText } = err.response
                NotificationServices.error(`${status}: ${statusText}`)
            })
            .finally(() => { setLoadingTransfer(false) })
    }

    return (
        <div className="flex flex-col w-full gap-4 xs:gap-4 lg:gap-4 justify-start items-center">
            <div className="flex flex-row xs:flex-col lg:flex-row w-full h-full bg-white gap-4 xs:gap-4 lg:gap-4">
                {/* Thông tin chuyển khoản */}
                <div className="flex flex-col w-2/3 xs:w-full lg:w-2/3 h-full shadow-md xs:shadow-none lg:shadow-md p-2 xs:p-1 lg:p-2 transition duration-300 hover:shadow-xl">
                    <Divider size={'xs'} label={<p className="flex text-base font-semibold text-gray-400 items-center gap-1"><IconCreditCard size={18} />Thông tin người chuyển</p>} labelPosition="left" variant="dashed" />
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base text-slate-400">Tài khoản nguồn</p>
                        <p className="flex flex-1 justify-end">{userInfo?.accountNumber}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base text-slate-400">Số dư</p>
                        <p className="flex flex-1 justify-end">1,200,000,000</p>
                    </div>
                    <Divider size={'xs'} label={<p className="flex text-base font-semibold text-gray-400 items-center gap-1"><IconDatabase size={18} />Thông tin người hưởng</p>} labelPosition="left" variant="dashed" />
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base text-slate-400">Ngân hàng</p>
                        <p className="flex flex-1 justify-end">Đông Á Bank</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base text-slate-400 items-center gap-2">Số tài khoản {loadingAccount && <Loader size={18} className="flex items-center" />}</p>
                        <TextInput
                            variant="unstyled"
                            placeholder="Số tài khoản"
                            classNames={{
                                input: classes.input
                            }}
                            rightSection={<IconUsers size={18} />}
                            value={toAccount}
                            className="flex items-center"
                            onChange={handleChangeToAccount}
                            onBlur={handleSearchAccount}
                        />
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base text-slate-400">Tên người nhận</p>
                        <p className="flex flex-1 justify-end">{receiver}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base text-slate-400">Mã giao dịch</p>
                        <p className="flex flex-1 justify-end">{refCode}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base text-slate-400">Nội dung chuyển tiền</p>
                        <Textarea
                            placeholder="Nội dung chuyển tiền"
                            variant="unstyled"
                            autosize
                            className="flex flex-1 w-full"
                            classNames={{
                                wrapper: classes.wrapper,
                                input: classes.input
                            }}
                            value={content}
                            onChange={handleChangeContent}
                        />
                    </div>
                    <div className="flex flex-row gap-2">
                        <Button
                            variant="filled"
                            className="xs:w-full sm:w-[12rem]"
                            onClick={handleBatchTransfer}
                            rightSection={loadingTransfer && <Loader size={18} color="white" />}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>

                <Divider size="xs" variant="dashed" orientation="vertical" className="xs:hidden lg:block" />

                {/* Thông tin giao dịch con */}
                <div className="flex flex-col flex-grow h-full shadow-md xs:shadow-none lg:shadow-md p-2 xs:p-1 lg:p-2 bg-gradient-to-b from-[#C9D6FF] to-[#E2E2E2]  transition duration-300 hover:shadow-xl">
                    <div className="flex flex-row justify-start items-center">
                        <div className="flex flex-1 flex-row text-slate-400 font-semibold justify-start items-center gap-2">
                            <p className="xs: hidden xl:block">Giao dịch:</p>
                            <Badge color={listTransaction.length < 10 ? 'blue' : 'green'} className="flex items-start h-full">{listTransaction.length}/10</Badge>

                        </div>
                        <p className="flex flex-1 justify-end text-gray-400 font-semibold">{numberWithCommas(totalAmount)}</p>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row flex-grow w-3/4 justify-start items-center gap-2">
                            <p className="flex text-base text-gray-400">Thông tin giao dịch </p>
                            <Divider my="sm" variant="dashed" className="flex flex-grow" />
                        </div>

                        <div className="flex w-[1.5rem] justify-end">
                            <IconCirclePlus size={24} className="flex fill-green-500 text-white cursor-pointer hover:fill-green-700" onClick={handleAddTransaction} />
                        </div>

                    </div>

                    <div className="flex flex-col flex-grow h-full ">
                        <div className="flex flex-row w-full">
                            <p className="flex flex-row justify-start w-1/6 text-slate-400 font-semibold">#</p>
                            <p className="flex flex-row flex-grow justify-end text-slate-400 font-semibold">Số tiền</p>
                            <p className="flex flex-row justify-end w-1/6 text-slate-400 font-semibold text-right">##</p>
                        </div>
                        <ScrollArea
                            offsetScrollbars
                            scrollbarSize={8}
                            className="h-[26rem] xs:h-[16rem] lg:h-[26rem]"
                            scrollHideDelay={0}
                        >
                            {
                                listTransaction.map((item, index) => (
                                    <div className="flex flex-row w-full items-center" key={index}>
                                        <p className="flex flex-row justify-start w-1/6">{index + 1}</p>
                                        <NumberInput
                                            variant="unstyled"
                                            placeholder="Số tiền"
                                            className="flex flex-row flex-grow justify-endv text-base"
                                            classNames={{
                                                wrapper: classes.wrapper,
                                                input: classes.input
                                            }}
                                            value={item}
                                            onChange={(data) => handleChangeAmount(data, index)}
                                            allowNegative={false}
                                            thousandSeparator=","
                                            hideControls
                                        />
                                        <p className="flex flex-row justify-end w-1/6 text-red-500 text-right"><IconTrash className="w-5 h-5 hover:text-red-700 cursor-pointer" onClick={(e) => handleRemoveTransaction(e, index)} /></p>
                                    </div>
                                ))
                            }
                        </ScrollArea>

                    </div>
                </div>

            </div>

            <TransactionResultModal data={modalData} opened={showModalResult} onClose={setShowModalResult} />
        </div>
    )
}

export default BatchTransfer