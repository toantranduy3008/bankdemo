import { NavLink } from '@mantine/core';
import { IconHome2, IconSearch, IconCash } from '@tabler/icons-react';

import { NavLink as RouterLink, useLocation } from 'react-router-dom';

const NavBar = () => {
    const { pathname } = useLocation()
    return (
        <>
            <NavLink label="Trang chủ" leftSection={<IconHome2 size="1rem" stroke={1.5} />} component={RouterLink} to={"bankdemo/home"} active={pathname === 'bankdemo/home'} />
            <NavLink label="Tìm kiếm giao dịch" leftSection={<IconSearch size="1rem" stroke={1.5} />} component={RouterLink} to={"bankdemo/inquiry"} active={pathname === 'bankdemo/inquiry'} />
            <NavLink
                label="Chuyển khoản"
                leftSection={<IconCash size="1rem" stroke={1.5} />}
                childrenOffset={28}
                defaultOpened
            >
                <NavLink label="CK qua mã QR" component={RouterLink} to={"bankdemo/qr-code"} active={pathname === 'bankdemo/qr-code'} />
                <NavLink label="CK thông thường" component={RouterLink} to={"bankdemo/transfer"} active={pathname === 'bankdemo/transfer'} />
                <NavLink label="CK với giao dịch lớn" component={RouterLink} to={"bankdemo/batch-transfer"} active={pathname === 'bankdemo/batch-transfer'} />
            </NavLink >
        </>
    );
}

export default NavBar