/* eslint-disable react/prop-types */
import { Modal } from '@mantine/core';
import { maskRefCode, numberWithCommas } from '../../services/Utilities';
import classess from './Modal.module.css'
import { setBadge } from '../../services/Utilities';
// eslint-disable-next-line react/prop-types
export const TransactionResultModal = ({ data, opened, onClose }) => {

    return (
        <>
            <Modal
                title={<p className="flex flex-1 justify-start items-center text-left font-bold uppercase text-sm">Thông tin chuyển khoản</p>}
                opened={opened}
                onClose={onClose}
                withCloseButton={true}
                size={"md"}
                centered
                className='flex flex-col'
                classNames={{
                    // header: classess.modalHeader,
                    close: classess.closeButton
                }}
            >

                <div className='flex flex-row w-full items-center justify-between hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100 gap-2'>
                    <p className='flex flex-1 font-semibold justify-end items-center text-right'>Ngân hàng nhận lệnh</p>
                    <p className='flex flex-1 justify-start items-center text-left gap-2'>Đông Á Bank  <img src="./NHNL.svg" className="w-7" /></p>
                </div>
                <div className='flex flex-row w-full items-center justify-between hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100 gap-2'>
                    <p className='flex flex-1 font-semibold justify-end items-center text-right'>Tài khoản nhận</p>
                    <p className='flex flex-1 justify-start items-center text-left'>{data.toAccount}</p>
                </div>
                <div className='flex flex-row w-full items-center justify-between hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100 gap-2'>
                    <p className='flex flex-1 font-semibold justify-end items-center text-right'>Người nhận</p>
                    <p className='flex flex-1 justify-start items-center text-left'>{data.receiver}</p>
                </div>
                <div className='flex flex-row w-full items-center justify-between hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100 gap-2'>
                    <p className='flex flex-1 font-semibold justify-end items-center text-right'>Số tham chiếu (Ref ID)</p>
                    <p className='flex flex-1 justify-start items-center text-left'>{maskRefCode(data.refCode)}</p>
                </div>
                <div className='flex flex-row w-full items-center justify-between hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100 gap-2'>
                    <p className='flex flex-1 font-semibold justify-end items-center text-right'>Số tiền</p>
                    <p className='flex flex-1 justify-start items-center text-left'>{numberWithCommas(data.amount ? data.amount : 0)}</p>
                </div>
                <div className='flex flex-row w-full items-center justify-between hover:bg-slate-200 hover:cursor-pointer even:bg-white odd:bg-slate-100 gap-2'>
                    <p className='flex flex-1 font-semibold justify-end items-center text-right'>Trạng thái</p>
                    <p className='flex flex-1 justify-start items-center text-left'>{setBadge(data.status)}</p>
                </div>
            </Modal>
        </>
    );
}