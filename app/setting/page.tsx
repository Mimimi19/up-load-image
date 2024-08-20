'use client';
import './style.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Setting() {
    const router = useRouter();

    const rootHelp = () => {
        router.push('/help');
    };

    const rootAbout = () => {
        router.push('/aboutSite');
    };

    return (
        <div className="settings-container">
            <h2 className="custom-heading">Setting</h2>
            <div className="button-group">
                <button className="settings-button" onClick={rootHelp}>
                    ヘルプページ
                </button>
                <button className="settings-button" onClick={rootAbout}>
                    このサイトについて
                </button>
            </div>
        </div>
    );
}
