'use client';
import { useRouter } from 'next/navigation';
import { Button, styled } from "@mui/material";

export default function LogoutCheck() {
    const router = useRouter();

    const CustomButton = styled(Button)({
        width: 150,
        padding: '10px 20px',
        margin: '0 10px', // ボタン同士に少し間隔を持たせる
    });

    const handleLogout = () => {
        console.log('Logging out...');
        router.push('/');
    };

    const backLogout = () => {
        router.push('/home');
    };

    return (
        <>
            <h1 className="mb-4 pt-28 text-4xl">本当にログアウトしますか？</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CustomButton
                    variant="contained"
                    href="#contained-buttons"
                    onClick={handleLogout}
                >
                    Yes
                </CustomButton>
                <CustomButton
                    variant="outlined"
                    onClick={backLogout}
                >
                    Back
                </CustomButton>
            </div>
        </>
    );
}
