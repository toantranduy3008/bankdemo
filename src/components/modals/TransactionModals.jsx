/* eslint-disable react/prop-types */
import { Modal, Badge } from '@mantine/core';
import { IconNorthStar, IconInfoCircle } from '@tabler/icons-react';

import { numberWithCommas } from '../../services/Utilities';
import classess from './Modal.module.css'
import { setBadge } from '../../services/Utilities';
// eslint-disable-next-line react/prop-types
export const TransactionResultModal = ({ data, opened, onClose }) => {

    return (
        <>
            <Modal
                title={
                    <div className='flex flex-row items-center justify-start gap-2'>
                        <IconInfoCircle size={20} className='flex text-white fill-sky-500' />
                        <p className='flex font-semibold text-white text-base'>Thông tin chuyển khoản</p>
                    </div>
                }
                opened={opened}
                onClose={onClose}
                withCloseButton={true}
                size={"md"}
                centered
                className='flex flex-col'
                classNames={{
                    header: classess.modalHeader,
                    close: classess.closeButton
                }}
            >

                <div className='flex flex-row w-full items-center justify-between'>
                    <div className='flex flex-1 justify-start items-center gap-2'>
                        <IconNorthStar size={18} className=' text-indigo-400' />
                        <p className='text-slate-400 font-semibold items-center'>Ngân hàng nhận lệnh</p>
                    </div>
                    <p className='flex flex-1 justify-end items-center'>Đông Á Bank</p>
                </div>
                <div className='flex flex-row w-full items-center justify-between'>
                    <div className='flex flex-1 justify-start items-center gap-2'>
                        <IconNorthStar size={18} className=' text-indigo-400' />
                        <p className='text-slate-400 font-semibold items-center'>Tài khoản nhận</p>
                    </div>
                    <p className='flex flex-1 justify-end items-center'>{data.toAccount}</p>
                </div>
                <div className='flex flex-row w-full items-center justify-between'>
                    <div className='flex flex-1 justify-start items-center gap-2'>
                        <IconNorthStar size={18} className=' text-indigo-400' />
                        <p className='text-slate-400 font-semibold items-center'>Người nhận</p>
                    </div>
                    <p className='flex flex-1 justify-end items-center'>{data.receiver}</p>
                </div>
                <div className='flex flex-row w-full items-center justify-between'>
                    <div className='flex flex-1 justify-start items-center gap-2'>
                        <IconNorthStar size={18} className=' text-indigo-400' />
                        <p className='text-slate-400 font-semibold items-center'>Mã giao dịch</p>
                    </div>
                    <p className='flex flex-1 justify-end items-center'>{data.refCode}</p>
                </div>
                <div className='flex flex-row w-full items-center justify-between'>
                    <div className='flex flex-1 justify-start items-center gap-2'>
                        <IconNorthStar size={18} className=' text-indigo-400' />
                        <p className='text-slate-400 font-semibold items-center'>Số tiền</p>
                    </div>
                    <p className='flex flex-1 justify-end items-center'>{numberWithCommas(data.amount ? data.amount : 0)}</p>
                </div>
                <div className='flex flex-row w-full items-center justify-between'>
                    <div className='flex flex-1 justify-start items-center gap-2'>
                        <IconNorthStar size={18} className=' text-indigo-400' />
                        <p className='text-slate-400 font-semibold items-center'>Trạng thái</p>
                    </div>
                    <p className='flex flex-1 justify-end items-center'>{setBadge(data.status)}</p>
                </div>
            </Modal>
        </>
    );
}