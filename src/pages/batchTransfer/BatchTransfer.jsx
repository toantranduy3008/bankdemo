
{/* react packages */ }
import { useRef, useState, useEffect } from "react"
{/* mantine packages */ }
import { NumberInput, ScrollArea, Divider, Badge, TextInput, Loader, Textarea, Button, Tooltip, LoadingOverlay } from "@mantine/core"
import classes from './Demo.module.css'
import { IconTrash, IconUsers, IconCreditCard, IconDatabase, IconCirclePlus } from "@tabler/icons-react"
import axios from "axios"
import { numberWithCommas } from "../../services/Utilities"
import NotificationServices from "../../services/notificationServices/NotificationServices"
import { getCurrentUser, authHeader } from "../../services/AuthServices"
import { TransactionResultModal } from "../../components/modals/TransactionModals"
import { formatVietnamese, validateInValidAmount } from "../../services/Utilities"

const BatchTransfer = () => {
    const userInfo = getCurrentUser()
    const accountRef = useRef(null)
    const contentRef = useRef(null)
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

    useEffect(() => {
        accountRef.current.focus();
    }, [])

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
                    contentRef.current.focus()
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

    const validData = () => {
        if (!toAccount) {
            NotificationServices.warning('Tài khoản nhận không được để trống.')
            accountRef.current.focus();
            return false
        }

        if (!receiver || !refCode) {
            NotificationServices.warning('Tài khoản không hợp lệ.')
            accountRef.current.focus();
            return false
        }

        if (!content || content.trim().length === 0) {
            NotificationServices.warning('Nội dung chuyển khoản không được để trống.')
            contentRef.current.focus();
            return false
        }

        if (listTransaction.length === 0 || listTransaction.includes('') || listTransaction.includes(undefined) || listTransaction.includes(0)) {
            NotificationServices.warning('Số tiền không hợp lệ.')
            return false
        }

        return true
    }

    const handleBatchTransfer = () => {
        const isValid = validData()
        if (!isValid) return

        const invalidAmount = listTransaction.some(x => validateInValidAmount(x))
        if (invalidAmount) {
            NotificationServices.warning('Số tiền phải lớn hơn 2,000 và nhỏ hơn 500,000,000.')
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
                const { status } = err.response
                NotificationServices.error(`${status}: Không thể thực hiện giao dịch.`)
            })
            .finally(() => { setLoadingTransfer(false) })
    }

    return (
        <div className="flex flex-col w-full gap-4 xs:gap-4 lg:gap-4 justify-start items-center">
            <div className="relative flex flex-row xs:flex-col lg:flex-row w-full h-full bg-white gap-4 xs:gap-4 lg:gap-4">
                <LoadingOverlay visible={loadingTransfer} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                {/* Thông tin chuyển khoản */}
                <div className="flex flex-col w-2/3 xs:w-full lg:w-2/3 h-full shadow-md xs:shadow-none lg:shadow-md p-2 xs:p-1 lg:p-2 transition duration-300 hover:shadow-xl">
                    <Divider size={'xs'} label={<p className="flex text-base font-semibold text-gray-400 items-center gap-1"><IconCreditCard size={18} />Thông tin người chuyển</p>} labelPosition="left" variant="dashed" />
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base ">Tài khoản nguồn</p>
                        <p className="flex flex-1 justify-end">{userInfo?.accountNumber}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base ">Tên người gửi</p>
                        <p className="flex flex-1 justify-end">{userInfo?.fullName}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base ">Số dư</p>
                        <p className="flex flex-1 justify-end">1,200,000,000</p>
                    </div>
                    <Divider size={'xs'} label={<p className="flex text-base font-semibold text-gray-400 items-center gap-1"><IconDatabase size={18} />Thông tin người hưởng</p>} labelPosition="left" variant="dashed" />
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base ">Ngân hàng</p>
                        <p className="flex flex-1 justify-end">Đông Á Bank</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base  items-center gap-2">Số tài khoản {loadingAccount && <Loader size={18} className="flex items-center" />}</p>
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
                            ref={accountRef}
                        />
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base ">Tên người nhận</p>
                        <p className="flex flex-1 justify-end">{receiver}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base ">Mã giao dịch</p>
                        <p className="flex flex-1 justify-end">{refCode}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base ">Nội dung chuyển tiền</p>
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
                            ref={contentRef}
                        />
                    </div>
                    <div className="flex flex-row gap-2">
                        <Button
                            variant="filled"
                            className="xs:w-full sm:w-[12rem]"
                            onClick={handleBatchTransfer}
                        // rightSection={loadingTransfer && <Loader size={18} color="white" />}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>

                <Divider size="xs" variant="dashed" orientation="vertical" className="xs:hidden lg:block" />

                {/* Thông tin giao dịch con */}
                <div className="flex flex-col flex-grow h-full shadow-md xs:shadow-none lg:shadow-md p-2 xs:p-1 lg:p-2 transition duration-300 hover:shadow-xl">
                    <div className="flex flex-row justify-start items-center">
                        <div className="flex flex-1 flex-row  font-semibold justify-start items-center gap-2">
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
                            <Tooltip label="Thêm giao dịch" color="#0ea5e9">
                                <IconCirclePlus size={24} className="flex fill-green-500 text-white cursor-pointer hover:fill-green-700" onClick={handleAddTransaction} />
                            </Tooltip>
                        </div>

                    </div>

                    <div className="flex flex-col flex-grow h-full ">
                        <div className="flex flex-row w-full">
                            <p className="flex flex-row justify-start w-1/6  font-semibold">#</p>
                            <p className="flex flex-row flex-grow justify-end  font-semibold">Số tiền</p>
                            <p className="flex flex-row justify-end w-1/6  font-semibold text-right">##</p>
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