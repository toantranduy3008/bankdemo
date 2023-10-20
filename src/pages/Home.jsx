import { Blockquote, List, ThemeIcon } from '@mantine/core';
import { IconInfoCircle, IconEye, IconFlare, IconDiscountCheck, IconCircleCheck } from '@tabler/icons-react';

const Home = () => {
    const icon = <IconInfoCircle />;
    return (
        <div className='flex flex-col'>
            <Blockquote color="blue" cite="– Về Napas" icon={icon} mt="xl">
                Công ty Cổ phần Thanh toán Quốc gia Việt Nam (NAPAS) là đơn vị Trung gian thanh toán được cấp phép cung ứng dịch vụ chuyển mạch tài chính và dịch vụ bù trừ điện tử tại Việt Nam. Cổ đông chính của NAPAS là Ngân hàng Nhà nước và các Ngân hàng thương mại.
                Với vai trò chuyển mạch tài chính Quốc gia và cung ứng hạ tầng thanh toán bán lẻ cho nền kinh tế, NAPAS đã và đang phối hợp với các Ngân hàng, Trung gian thanh toán và đối tác cung cấp các dịch vụ thanh toán thông qua thẻ, tài khoản ngân hàng, QR code, Mobile Money... để xây dựng hệ sinh thái thanh toán không tiền mặt Việt Nam. Đồng thời, NAPAS cũng mở rộng triển khai dịch vụ chuyển mạch quốc tế thông qua hợp tác với các bên liên quan gồm  Mạng thanh toán Châu Á (Asian Payment Network-APN), các Tổ chức Thẻ quốc tế, các tổ chức thanh toán quốc gia…
                Trong thời gian tới, NAPAS tiếp tục định hướng phát triển trở thành mạng lưới thanh toán bán lẻ đáng tin cậy nhất với Chính phủ, Ngân hàng, Trung gian thanh toán, khách hàng và các đối tác.
            </Blockquote>

            <Blockquote color="green" cite="– Tầm nhìn" icon={<IconEye />} mt="xl">
                Trở thành mạng lưới thanh toán bán lẻ đáng tin cậy nhất với Chính phủ, Ngân hàng, Trung gian thanh toán, khách hàng và các đối tác thông qua hợp tác cùng mang đến những sản phẩm thanh toán sáng tạo, dễ tiếp cận, dễ sử dụng và đáng tin cậy đối với người dân Việt Nam
            </Blockquote>

            <Blockquote color="violet" cite="– Sứ mệnh" icon={<IconFlare />} mt="xl">
                Gắn kết người dân, doanh nghiệp và các ngân hàng bằng các sản phẩm thanh toán sáng tạo cho cuộc sống hàng ngày.
            </Blockquote>

            <Blockquote color="red" cite="– Giá trị cốt lõi" icon={<IconDiscountCheck />} mt="xl">
                <List
                    spacing="xs"
                    size="sm"
                    center
                    icon={
                        <ThemeIcon color="teal" size={24} radius="xl">
                            <IconCircleCheck size="1rem" />
                        </ThemeIcon>
                    }
                >
                    <List.Item>Làm việc nhóm và hợp tác</List.Item>
                    <List.Item>Sáng tạo và đổi mới</List.Item>
                    <List.Item>Chính trực</List.Item>
                    <List.Item>Cam kết</List.Item>
                </List>
            </Blockquote>
        </div>



    );
}

export default Home