import { useState, useRef, useEffect } from "react"
import { Divider, TextInput, Loader, Textarea, Button, NumberInput, LoadingOverlay } from "@mantine/core"
import { IconUsers, IconCreditCard, IconDatabase, IconCoin } from "@tabler/icons-react"
import classes from './Transfer.module.css'
import { authHeader, getCurrentUser } from "../../services/AuthServices"
import { formatVietnamese, validateInValidAmount } from "../../services/Utilities"
import NotificationServices from "../../services/notificationServices/NotificationServices"
import axios from "axios"
import { TransactionResultModal } from "../../components/modals/TransactionModals"

const Transfer = () => {
    const userInfo = getCurrentUser()
    const accountRef = useRef(null)
    const amountRef = useRef(null)
    const contentRef = useRef(null)
    const [toAccount, setToAccount] = useState('')
    const [receiver, setReceiver] = useState('')
    const [refCode, setRefCode] = useState('')
    const [content, setContent] = useState('')
    const [amount, setAmount] = useState(0)
    const [modalData, setModalData] = useState({})
    const [loadingAccount, setLoadingAccount] = useState(false)
    const [loadingTransfer, setLoadingTransfer] = useState(false)
    const [showModalResult, setShowModalResult] = useState(false)

    useEffect(() => {
        accountRef.current.focus();
    }, [])

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

    const handleChangeAmount = (data) => {
        setAmount(data)
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

        if (!amount || amount === 0) {
            NotificationServices.warning('Số tiền không được để trống.')
            amountRef.current.focus()
            return false
        }

        if (!content || content.trim().length === 0) {
            NotificationServices.warning('Nội dung chuyển khoản không được để trống.')
            contentRef.current.focus();
            return false
        }

        const invalidAmount = validateInValidAmount(amount)
        if (invalidAmount) {
            NotificationServices.warning('Số tiền phải lớn hơn 2,000 và nhỏ hơn 500,000,000.')
            return false
        }

        return true
    }

    const handleTransfer = () => {
        const isValid = validData()
        if (!isValid) return

        const requestBody = {
            amount: amount,
            content: content,
            creditorAgent: '970406',
            f63: refCode,
            toAccount: toAccount
        }

        setLoadingTransfer(true)
        axios.post('/bankdemo/api/payment/fundtransfer', requestBody, { headers: authHeader() })
            .then(
                res => {
                    const { f39, f63 } = res.data
                    NotificationServices.info(refCode)
                    setToAccount('')
                    setReceiver('')
                    setRefCode('')
                    setContent('')
                    setAmount(0)
                    setModalData({
                        status: f39,
                        toAccount: toAccount,
                        refCode: f63,
                        receiver: receiver,
                        amount: amount
                    })

                    setShowModalResult(!showModalResult)
                }
            )
            .catch(err => {
                const { status } = err.response
                NotificationServices.error(`${status}: Không thể thực hiện giao dịch.`)
            })
            .finally(() => { setLoadingTransfer(false) })
    }
    return (
        <div className="flex flex-col w-full gap-4 xs:gap-4 lg:gap-4 justify-center items-center bg-[#f9f9f9]">
            <div className="flex flex-row xs:flex-col lg:flex-row w-full h-full bg-white gap-4 xs:gap-4 lg:gap-4 justify-center items-center">
                <div className="relative flex flex-col w-2/3 xs:w-full lg:w-2/3 h-full shadow-md xs:shadow-none lg:shadow-md p-2 xs:p-1 lg:p-2 transition duration-300 hover:shadow-xl">
                    <LoadingOverlay visible={loadingTransfer} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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
                                input: classes.input,
                                wrapper: classes.wrapper
                            }}
                            rightSection={<IconUsers size={18} />}
                            value={toAccount}
                            className="flex flex-1 items-center justify-end"
                            onChange={handleChangeToAccount}
                            onBlur={handleSearchAccount}
                            ref={accountRef}
                        />
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base  items-center">Tên người nhận</p>
                        <p className="flex flex-1 justify-end">{receiver}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base  items-center">Mã giao dịch</p>
                        <p className="flex flex-1 justify-end">{refCode}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base  items-center">Số tiền</p>
                        <NumberInput
                            variant="unstyled"
                            placeholder="Số tiền"
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper
                            }}
                            allowNegative={false}
                            thousandSeparator=","
                            value={amount}
                            onChange={handleChangeAmount}
                            rightSectionPointerEvents="none"
                            rightSection={<IconCoin size={18} />}
                            className="flex flex-1 items-center justify-end"
                            ref={amountRef}
                        />
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base ">Nội dung chuyển tiền</p>
                        <Textarea
                            placeholder="Nội dung chuyển tiền"
                            variant="unstyled"
                            autosize
                            className="flex flex-1 w-full items-center"
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
                            onClick={handleTransfer}
                        // rightSection={loadingTransfer && <Loader size={18} color="white" />}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </div>

            <TransactionResultModal data={modalData} opened={showModalResult} onClose={setShowModalResult} />
        </div>
    )
}

export default Transfer