
{/* react packages */ }
import { useRef, useState, useEffect } from "react"
{/* mantine packages */ }
import { NumberInput, ScrollArea, Divider, Badge, TextInput, Loader, Textarea, Button, Tooltip, LoadingOverlay, Switch, Modal, Select } from "@mantine/core"
import classes from './Demo.module.css'
import { IconTrash, IconUsers, IconCreditCard, IconDatabase, IconCirclePlus, IconInfoCircle } from "@tabler/icons-react"
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
    const [totalAmountDetach, setTotalAmountDetach] = useState(0)
    const [toAccount, setToAccount] = useState('')
    const [receiver, setReceiver] = useState('')
    const [refCode, setRefCode] = useState('')
    const [content, setContent] = useState('')
    const [loadingAccount, setLoadingAccount] = useState(false)
    const [modalData, setModalData] = useState({})
    const [loadingTransfer, setLoadingTransfer] = useState(false)
    const [showModalResult, setShowModalResult] = useState(false)
    const [autoDetach, setAutoDetach] = useState(true)
    const [showDetachModal, setShowDetachModal] = useState(false)
    const [listBank, setListBank] = useState([{ value: '970406', label: 'ĐÔNG Á BANK' }])
    const [bankId, setBankId] = useState("970406")
    useEffect(() => {
        accountRef.current.focus();
        axios.get('/bankdemo/api/payment/getListBank', { headers: authHeader() })
            .then(res => {
                const { listBank } = res.data
                const banks = listBank.map(item => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                })
                setBankId(banks[0].value)
                setListBank(banks)
            })
            .catch(() => {
                // accountRef.current.focus()
                NotificationServices.error('Không tìm được danh sách ngân hàng thụ hưởng.')
                return;
            })
            .finally(() => { setLoadingAccount(false) })

    }, [])

    const handleChangeBank = (e) => {
        setBankId(e)
        setToAccount('')
        setReceiver('')
        setRefCode('')
    }

    const handleAddTransaction = () => {
        if (!autoDetach) {
            // Trường hợp không bật tự động chia nhỏ số tiền
            setListTransaction(current => [...current, 0])
        }
        else {
            // Trường hợp bật tự động chia nhỏ số tiền
            setShowDetachModal(!showDetachModal)
        }
    }

    const handleDetachAmount = () => {
        if (totalAmountDetach < 2000) {
            NotificationServices.warning('Số tiền phải lớn hơn 2,000')
            return
        }

        let a = totalAmountDetach
        let b = totalAmountDetach
        const list = [499, 450, 400, 350, 300, 250, 200, 150, 100, 50, 30, 20, 10, 5, 3, 2]
        const output = []
        let total = 0
        while (total < b) {
            for (let i = 0; i < list.length; i++) {
                if (a >= list[i] * 1000000) {
                    output.push(list[i] * 1000000)
                    total += list[i] * 1000000
                    a -= list[i] * 1000000
                } else {
                    a > 0 && output.push(a)
                    total += a
                    break
                }
            }
        }

        setListTransaction(output)
        setTotalAmount(totalAmountDetach)
        setShowDetachModal(false)
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
            axios.get(`/bankdemo/api/payment/investigatename?creditorAgent=${bankId}&toAccount=${toAccount}`, { headers: authHeader() })
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
                    // accountRef.current.focus()
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
            creditorAgent: bankId,
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
                setTotalAmountDetach(0)
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
            <div className="relative flex flex-row xs:flex-col lg:flex-row xs:w-full lg:w-2/3 h-full gap-4 xs:gap-4 lg:gap-4">
                <LoadingOverlay visible={loadingTransfer} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                {/* Thông tin chuyển khoản */}
                <div className="flex flex-col flex-1 xs:w-full lg:w-1/3 h-full shadow-md xs:shadow-none lg:shadow-md p-2 xs:p-1 lg:p-2 transition duration-300 hover:shadow-xl bg-white">
                    <Divider size={'xs'} label={<p className="flex text-base font-semibold text-gray-400 items-center gap-1"><IconCreditCard size={18} />Thông tin người chuyển</p>} labelPosition="left" variant="dashed" />
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base font-semibold ">Tài khoản nguồn</p>
                        <p className="flex flex-1 justify-end">{userInfo?.accountNumber}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base font-semibold ">Tên người gửi</p>
                        <p className="flex flex-1 justify-end text-end">{userInfo?.fullName}</p>
                    </div>
                    <Divider size={'xs'} label={<p className="flex text-base font-semibold text-gray-400 items-center gap-1"><IconDatabase size={18} />Thông tin người hưởng</p>} labelPosition="left" variant="dashed" />
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base font-semibold ">Ngân hàng</p>
                        <Select
                            data={listBank}
                            defaultValue={bankId}
                            variant="unstyled"
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper
                            }}
                            className="flex flex-1 items-center justify-end"
                            onChange={handleChangeBank}
                        />
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base font-semibold  items-center gap-2">Số tài khoản {loadingAccount && <Loader size={18} className="flex items-center" />}</p>
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
                        <p className="flex flex-1 text-base font-semibold ">Tên người nhận</p>
                        <p className="flex flex-1 justify-end text-end">{receiver}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base font-semibold ">Mã giao dịch</p>
                        <p className="flex flex-1 justify-end">{refCode}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="flex flex-1 text-base font-semibold ">Nội dung chuyển tiền</p>
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
                            rightSection={loadingTransfer && <Loader size={18} color="white" />}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>

                <Divider size="xs" variant="dashed" orientation="vertical" className="xs:hidden lg:block" />

                {/* Thông tin giao dịch con */}
                <div className="flex flex-col flex-1 h-full shadow-md xs:shadow-none lg:shadow-md p-2 xs:p-1 lg:p-2 transition duration-300 hover:shadow-xl bg-white">
                    <div className="flex flex-row justify-start items-center">
                        <div className="flex flex-1 flex-row  font-semibold justify-start items-center gap-2">
                            <Badge color={listTransaction.length < 10 ? 'blue' : 'green'} className="flex items-start h-full">{listTransaction.length}</Badge>
                            <p className="xs: hidden xl:block">Giao dịch</p>
                        </div>
                        <p className="flex flex-1 justify-end text-gray-400 font-semibold">{numberWithCommas(totalAmount)}</p>
                    </div>
                    <div className="flex flex-row justify-start items-center gap-1 xs:gap-0 md:gap-1">
                        <Switch
                            size="sm"
                            onLabel="ON"
                            offLabel="OFF"
                            label="Tự động chia số tiền"
                            checked={autoDetach} onChange={(event) => setAutoDetach(event.currentTarget.checked)}
                            classNames={{
                                track: classes.track
                            }}
                        />
                        <Tooltip label="Số tiền sẽ được tự động chia thành các mức nhỏ hơn để phù hợp với quy định của Napas." color="#0ea5e9">
                            <IconInfoCircle size={18} className="text-white flex fill-sky-500 cursor-pointer" />
                        </Tooltip>

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
                            className="h-[25rem] xs:h-[16rem] lg:h-[25rem]"
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
            <Modal opened={showDetachModal} onClose={setShowDetachModal} title="Thông tin">
                <div className="flex flex-col w-full items-center justify-start gap-2">
                    <NumberInput
                        // variant="unstyled"
                        label="Số tiền"
                        placeholder="Số tiền"
                        className="flex flex-row flex-grow justify-endv text-base w-full"
                        classNames={{
                            wrapper: classes.wrapper,
                            input: classes.input,
                            label: classes.numberLabel
                        }}
                        value={totalAmountDetach}
                        onChange={(data) => setTotalAmountDetach(data)}
                        allowNegative={false}
                        thousandSeparator=","
                        hideControls
                    />
                    {/* <p className="flex justify-start items-center w-full text-sm">* Số tiền sẽ được tự động tách thành các phần nhỏ hơn</p> */}
                    <Button
                        variant="filled"
                        className="flex w-full justify-center items-center"
                        onClick={handleDetachAmount}
                    // rightSection={loadingTransfer && <Loader size={18} color="white" />}
                    >
                        Xác nhận
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default BatchTransfer