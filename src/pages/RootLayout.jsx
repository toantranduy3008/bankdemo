import { AppShell, Burger } from "@mantine/core";
import Header from "../components/header/Header";
import NavBar from "../components/navbar/Navbar";
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from "react-router-dom";

const RootLayout = () => {
    const [opened, { toggle }] = useDisclosure();
    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header className="flex flex-row  bg-gradient-to-r from-[#2980B9] to-[#6DD5FA] ">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" className=" h-full justify-center items-center text-white" />
                <Header />
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <NavBar toggle={toggle} />
            </AppShell.Navbar>
            <AppShell.Main className="flex bg-[url('/napas-bg.jpg')] bg-center bg-cover bg-no-repeat ">
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}

export default RootLayout