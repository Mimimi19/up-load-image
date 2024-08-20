'use client';
import { useRouter } from 'next/navigation';
import './style.css';

export default function LogoutCheck() {
    const router = useRouter();

    const handleLogout = () => {
        console.log('Logging out...');
        router.push('/');
    };

    const backLogout = () => {
        router.push('/home');
    };

    return (
        <>
            <h2 className="logout">Logout</h2>
            <div className="button-group">
                <button className="custom-buttonYes" onClick={handleLogout}>ログアウトする</button>
                <button className="custom-buttonNo" onClick={backLogout}>戻る</button>
            </div>
        </>
    );
}
