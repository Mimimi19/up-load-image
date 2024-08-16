'use client'
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import deleteRowById from "./deletaPost";
import { useRouter } from "next/navigation";

interface Comment {
    comment: string;
    event_date: string; // 修正：created_at から event_date に変更
    latitude: string;
    longitude: string;
    id: string;
    user_id: string;
}

export default function DetailPage() {
    const pathname = usePathname();
    const photoUrl = pathname.replace(/^\/detail\//, '');
    console.log(photoUrl);
    const [user_id, setUserId] = useState<string>("");
    const public_url = `https://xydxmymbedqcfqzzjmgk.supabase.co/storage/v1/object/public/public-image-bucket/img/${user_id}/`;

    const [loadingState, setLoadingState] = useState("hidden");
    const [comment, setComment] = useState<Comment>();
    const supabase = createClientComponentClient();
    const router = useRouter();

    const handleDelete = () => {
    //window対策を講じる
        const confirmDelete = window.confirm("本当に削除しますか？");
        if (confirmDelete && comment) {
            deleteRowById(comment.id, comment.user_id, photoUrl)
                .then(() => {
                    router.push('/home'); // 削除成功後に/homeへリダイレクト
                })
                .catch(error => {
                    console.error('削除に失敗しました:', error);
                });
        } else {
            console.log('削除はキャンセルされました');
        }
    };

    useEffect(() => {
        supabase.auth.getUser().then((user) => {
            if (user.data.user === null) {
                // ユーザーがサインインしていない場合、警告を表示
                return alert("ログインしてください");
            }
            setUserId(user.data.user.id);
        });
    }, []);

    const image = async () => {
        const tempUrlList: string[] = [];
        setLoadingState("flex justify-center");

        const { data } = await supabase
            .storage
            .from('public-image-bucket')
            .getPublicUrl(photoUrl);

        await fetchComment(photoUrl);
        setLoadingState("hidden");
    };

    const fetchComment = async (imageUrl: string) => {
        const { data, error } = await supabase
            .from('comments')
            .select('user_id, id, comment, event_date, latitude, longitude') // 修正：created_at を event_date に変更
            .eq('image_name', photoUrl);

        if (error) {
            console.log(error);
        }

        if (data !== null) {
            setComment(
                {
                    comment: data[0].comment,
                    event_date: data[0].event_date,
                    latitude: data[0].latitude,
                    longitude: data[0].longitude,
                    id: data[0].id,
                    user_id: data[0].user_id,
                }
            );
        }
    };

    useEffect(() => {
        if (user_id) {
            image();
        }
    }, [user_id]);

    return (
        <div className="w-screen max-w-3xl">
            <div className={loadingState} aria-label="読み込み中">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
            <ul className="flex flex-wrap w-full">
                <li className="h-auto p-1">
                    <img className="object-cover" style={{ aspectRatio: 1 / 1 }} src={public_url + photoUrl} alt={photoUrl} />
                    <ul className="mt-2">
                        <li className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{comment?.comment}</li>
                        <span className="text-xs subText ml-2">
                            日付: {comment?.event_date} {/* 修正：created_at を event_date に変更 */}
                        </span>
                        <p>longitude: {comment?.longitude}</p>
                        <p>latitude: {comment?.latitude}</p>
                    </ul>
                </li>
            </ul>
            <Link href={{ pathname: "/home", query: { longitude: comment?.longitude, latitude: comment?.latitude } }}>
                位置に移動する
            </Link>
            <p>{comment?.id}</p>
            <p>{comment?.user_id}</p>
            <button onClick={handleDelete}>
                削除
            </button>
        </div>
    );
}
