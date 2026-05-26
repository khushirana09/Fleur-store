import { HomePage } from '../pages'
import { VerifyEmail } from '@/pages/Auth/VerifyEmail'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth/verify" element={<VerifyEmail />} />
            </Routes>
        </BrowserRouter>
    )
}