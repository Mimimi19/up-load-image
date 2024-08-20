import './style.css';
import Image from "next/image";
import Link from 'next/link'
export default function AboutSite() {
    return (
        <>
            <div className="header-container">
                <h2 className="custom-heading">このサイトについて</h2>
            </div>
            <div className="teamname">作成チーム</div>
            <div className="detailname">りんごかじり虫</div>
            <Link href="https://www.instagram.com/___n.s415/profilecard/?igsh=MW5pazB6d3dyMmhiaQ==">Shoooooooma</Link>
            <Link href="https://www.instagram.com/un_my_04915/profilecard/?igsh=MTY2dTB1OW5zbTVrdg==">ゆった</Link>
            <Link href="https://www.instagram.com/mz7042406?igsh=dTQ3cmJiMHNqbTZ4&utm_source=qr">ホズミ</Link>
            <Link href="https://www.instagram.com/ru1y_o?igsh=MW0wOXhra3J2enRvaQ%3D%3D&utm_source=qr">もりた まさたか</Link>
            <div className="tools">技術スタック</div>
            <div className="image-row">
                <Link href="https://nextjs.org/">
                    <Image
                        className="nextjs"
                        src="/imagefile/Nextjs.png"
                        width={100}
                        height={100}
                        alt="Next.js Icon"
                    />
                </Link>
                <Link href="https://supabase.com/">
                    <Image
                        className="supabase"
                        src="/imagefile/supabase.png"
                        width={100}
                        height={100}
                        alt="Supabase Icon"
                    />
                </Link>
                <Link href="https://tailwindcss.com/">
                    <Image
                        className="tailwindcss"
                        src="/imagefile/tailwind.png"
                        width={100}
                        height={100}
                        alt="Tailwind CSS Icon"

                    />
                </Link>
                <Link href="https://github.co.jp/">
                    <Image
                        className="github"
                        src="/imagefile/github copy.png"
                        width={100}
                        height={100}
                        alt="github Icon"

                    />
                </Link>
                <Link href="https://vercel.com/docs">
                    <Image
                        className="vercel"
                        src="/imagefile/vercel.png"
                        width={100}
                        height={100}
                        alt="vercel Icon"

                    />
                </Link>
                <Link href="https://ja.react.dev/">
                    <Image
                        className="react"
                        src="/imagefile/React copy.png"
                        width={100}
                        height={100}
                        alt="react Icon"

                    />
                </Link>
                <Link href="https://developers.google.com/maps/documentation/javascript?hl=ja">
                    <Image
                        className="googlemapapi"
                        src="/imagefile/googlemap copy.png"
                        width={100}
                        height={100}
                        alt="google map api Icon"

                    />
                </Link>
            </div>
        </>
    );
}