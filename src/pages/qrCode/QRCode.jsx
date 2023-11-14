import { useState } from "react"
import { Divider, TextInput, Loader, Textarea, Button, NumberInput, LoadingOverlay } from "@mantine/core"
import { IconCreditCard, IconDatabase, IconCoin, IconDiscountCheck } from "@tabler/icons-react"
import QrReader from 'react-qr-scanner'
import { QRPay } from 'vietnam-qr-pay';
import classes from './QRCode.module.css'
import { authHeader, getCurrentUser } from "../../services/AuthServices"
import { formatVietnamese, maskRefCode, validateInValidAmount } from "../../services/Utilities"
import NotificationServices from "../../services/notificationServices/NotificationServices"
import axios from "axios"
import { TransactionResultModal } from "../../components/modals/TransactionModals"

const QRCode = () => {
    const previewStyle = {
        height: '100%',
        width: '100%   ',
    }
    const userInfo = getCurrentUser()
    const [toAccount, setToAccount] = useState('')
    const [receiver, setReceiver] = useState('')
    const [refCode, setRefCode] = useState('')
    const [content, setContent] = useState('')
    const [amount, setAmount] = useState(0)
    const [modalData, setModalData] = useState({})
    const [loadingAccount, setLoadingAccount] = useState(false)
    const [loadingTransfer, setLoadingTransfer] = useState(false)
    const [showModalResult, setShowModalResult] = useState(false)
    const [showQRCode, setShowQRCode] = useState(true)
    const handleScan = (data) => {
        if (data) {
            const qrPay = new QRPay(data.text);
            console.log(qrPay)
            setToAccount(qrPay.consumer.bankNumber)
            setAmount(qrPay.amount ?? 0)
            setContent(qrPay.additionalData.purpose ?? '')
            axios.get(`/bankdemo/api/payment/investigatename?creditorAgent=${qrPay.consumer.bankBin}&toAccount=${qrPay.consumer.bankNumber}`, { headers: authHeader() })
                .then(
                    res => {
                        const { f39, f63, f120 } = res.data
                        if (f39 !== '00') {
                            NotificationServices.error('Không tìm được thông tin tài khoản');
                            return;
                        }

                        setReceiver(f120)
                        setRefCode(f63)
                        setShowQRCode(false)
                    }
                )
                .catch(() => {
                    NotificationServices.error('Không tìm được thông tin tài khoản.')
                    return;
                })
                .finally()
        }
    }

    const handleError = () => {

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

    const handleChangeAmount = (data) => {
        setAmount(data)
    }

    const inValidData = () => {
        if (!toAccount || !receiver || !refCode || !content || !amount || amount === 0) {
            return true
        }

        return false
    }

    const handleTransfer = () => {
        if (inValidData()) {
            NotificationServices.warning('Bạn cần nhập đầy đủ thông tin.')
            return
        }

        const invalidAmount = validateInValidAmount(amount)
        if (invalidAmount) {
            NotificationServices.warning('Số tiền phải lớn hơn 2,000 và nhỏ hơn 500,000,000.')
            return
        }

        const requestBody = {
            amount: amount,
            content: content,
            creditorAgent: '970406',
            f63: refCode,
            toAccount: toAccount,
            f60: 99
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
                    // setShowQRCode(true)
                }
            )
            .catch(err => {
                const { status } = err.response
                NotificationServices.error(`${status}: Không thể thực hiện giao dịch.`)
            })
            .finally(() => {
                setLoadingTransfer(false)
                // setShowQRCode(true)
            })
    }
    return (

        <div className="flex flex-col w-full gap-4 xs:gap-4 lg:gap-4 justify-center items-center">
            {/* <button onClick={() => setShowQRCode(!showQRCode)}>toggle</button> */}
            <div className="flex flex-row xs:flex-col lg:flex-row w-full h-full gap-4 xs:gap-4 lg:gap-4 justify-center items-center">
                {/* qr scan */}
                {
                    showQRCode &&
                    <div className="flex flex-col bg-slate-400 w-2/3 xs:w-full lg:w-2/3 h-full shadow-md xs:shadow-none lg:shadow-md p-2 xs:p-1 lg:p-2 transition duration-300 hover:shadow-xl">
                        <QrReader
                            className="shadow-md"
                            delay={100}
                            style={previewStyle}
                            onError={handleError}
                            onScan={handleScan}
                            constraints={{
                                video: { facingMode: "environment" }
                            }}
                        />
                    </div>
                }

                {/* form thông tin */}
                {
                    !showQRCode &&
                    <div className="relative flex flex-col w-1/3 xs:w-full lg:w-1/3 h-full shadow-md xs:shadow-none lg:shadow-md bg-white p-2 xs:p-1 lg:p-2 transition duration-300 hover:shadow-xl">
                        <LoadingOverlay visible={loadingTransfer} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                        <Divider size={'xs'} label={<p className="flex text-base font-semibold text-gray-400 items-center gap-1"><IconCreditCard size={18} />Thông tin người chuyển</p>} labelPosition="left" variant="dashed" />
                        <div className="flex flex-row hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 text-base font-semibold">Tài khoản nguồn</p>
                            <p className="flex flex-1 justify-end">{userInfo?.accountNumber}</p>
                        </div>
                        <div className="flex flex-row hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 text-base font-semibold ">Tên người gửi</p>
                            <p className="flex flex-1 justify-end text-end">{userInfo?.fullName}</p>
                        </div>
                        <Divider size={'xs'} label={<p className="flex text-base font-semibold text-gray-400 items-center gap-1"><IconDatabase size={18} />Thông tin người hưởng</p>} labelPosition="left" variant="dashed" />
                        <div className="flex flex-row hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 text-base font-semibold ">Ngân hàng</p>
                            <p className="flex flex-1 justify-end">Đông Á Bank</p>
                        </div>
                        <div className="flex flex-row hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 text-base font-semibold  items-center gap-2">Số tài khoản {loadingAccount && <Loader size={18} className="flex items-center" />}</p>
                            <TextInput
                                variant="unstyled"
                                placeholder="Số tài khoản"
                                classNames={{
                                    input: classes.input,
                                    wrapper: classes.wrapper
                                }}
                                rightSection={<IconDiscountCheck size={18} color="#0ea5e9" />}
                                value={toAccount}
                                className="flex flex-1 items-center justify-end"
                                onChange={handleChangeToAccount}
                                onBlur={handleSearchAccount}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-row hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 text-base font-semibold  items-center">Tên người nhận</p>
                            <p className="flex flex-1 justify-end text-end">{receiver}</p>
                        </div>
                        <div className="flex flex-row hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 text-base font-semibold  items-center">Số tham chiếu (Ref ID)</p>
                            <p className="flex flex-1 justify-end">{maskRefCode(refCode)}</p>
                        </div>
                        <div className="flex flex-row hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 text-base font-semibold  items-center">Số tiền</p>
                            <NumberInput
                                variant="unstyled"
                                placeholder="Số tiền"
                                classNames={{
                                    input: classes.input,
                                    wrapper: classes.wrapper
                                }}
                                thousandSeparator=","
                                value={amount}
                                onChange={handleChangeAmount}
                                rightSectionPointerEvents="none"
                                rightSection={<IconCoin size={18} />}
                                className="flex flex-1 items-center justify-end"
                            />
                        </div>
                        <div className="flex flex-row hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100">
                            <p className="flex flex-1 text-base font-semibold ">Nội dung chuyển tiền</p>
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
                            />
                        </div>
                        <div className="flex flex-row gap-2 ">
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
                }

            </div>

            <TransactionResultModal data={modalData} opened={showModalResult} onClose={setShowModalResult} />
        </div>
    )
}

export default QRCode