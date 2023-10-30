import { useNavigate } from "react-router-dom";

import { Menu, rem } from "@mantine/core"
import {
    IconSettings,
    IconLogout,
    IconBuildingBank,
    IconDiscount,
    IconUserCircle
} from '@tabler/icons-react';
const Header = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem('userSession')
        navigate('bankdemo/login')
    }
    return (
        <div className="flex flex-row w-full h-full justify-between items-center p-2">
            <div className="flex flex-1 h-full justify-start items-center ">
                <img src={'./napas-white.png'} className=" w-auto xs:w-24 h-12 xs:h-auto align-middle border-none " />
            </div>
            <div className="flex flex-1 justify-center items-center">
                <p className="text-white text-lg text-center font-semibold xs:hidden md:block md:text-lg">NGÂN HÀNG VINABANK - NAPAS</p>
            </div>
            <div className="flex flex-1 h-full justify-end items-center">
                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                        <IconUserCircle className=" w-7 h-7 text-white hover:text-yellow-700 cursor-pointer" />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Ứng dụng</Menu.Label>
                        <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                            Cài đặt
                        </Menu.Item>
                        <Menu.Item leftSection={<IconBuildingBank style={{ width: rem(14), height: rem(14) }} />}>
                            Danh sách ngân hàng
                        </Menu.Item>
                        <Menu.Item leftSection={<IconDiscount style={{ width: rem(14), height: rem(14) }} />}>
                            Danh sách KM
                        </Menu.Item>
                        <Menu.Divider />

                        <Menu.Label>Người dùng</Menu.Label>
                        <Menu.Item
                            color="red"
                            leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>

            </div>
        </div>
    )
}

export default Header