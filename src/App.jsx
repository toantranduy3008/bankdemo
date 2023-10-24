import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import RootLayout from './pages/RootLayout';
import QRCode from './pages/qrCode/QRCode';
import Login from './pages/Login';
import Inquiry from './pages/inquiry/Inquiry';
import Home from './pages/Home';
import BatchTransfer from './pages/batchTransfer/BatchTransfer';
import Transfer from './pages/transfer/Transfer';
import ProtectedRoute from './components/PrivateRoutes';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <MantineProvider>
      <ModalsProvider>
        <Notifications />
        <Routes>
          <Route path='bankdemo/login' element={<Login />} />
          <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
            <Route path='bankdemo/' element={<Home />} />
            <Route path='bankdemo/home' element={<Inquiry />} />
            <Route path="bankdemo/qr-code" element={<QRCode />} />
            <Route path="bankdemo/inquiry" element={<Inquiry />} />
            <Route path="bankdemo/transfer" element={<Transfer />} />
            <Route path="bankdemo/batch-transfer" element={<BatchTransfer />} />
          </Route>
        </Routes>
      </ModalsProvider>
    </MantineProvider>

  )
}