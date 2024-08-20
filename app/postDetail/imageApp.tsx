"use client";
import { supabase } from "@/utils/supabase/supabase";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import heic2any from "heic2any"; // HEIC変換ライブラリをインポート
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation"; // useRouterをインポート
import "./style.css"
import Textarea from '@mui/joy/Textarea';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';

export default function ImageApp() {
  const [user_id, setUserId] = useState<string>("");
  const public_url = `https://xydxmymbedqcfqzzjmgk.supabase.co/storage/v1/object/public/public-image-bucket/img/${user_id}/`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ステート管理
  const [eventDate, setEventDate] = useState<string>(""); // 日付 追加
  const [urlList, setUrlList] = useState<string[]>([]); // 画像URLリスト
  const [loadingState, setLoadingState] = useState(false); // ローディング状態
  const [comments, setComments] = useState<{ [key: string]: { comment: string; created_at: string; event_date: string }[] }>({}); // 画像ごとのコメント
  const [file, setFile] = useState<File>(); // アップロードするファイル
  const [comment, setComment] = useState<string>(""); // コメントの値
  const [errorMessage, setErrorMessage] = useState<string>(""); // エラーメッセージ
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // ボタンの無効化状態を管理するステートを追加
  const router = useRouter(); // useRouterを初期化

  const params = useSearchParams();
  const lat = params.get('lat');
  const lng = params.get('lng');


  const [disabled, setDisabled] = useState(false);

  const supabase = createClientComponentClient();
  useEffect(() => {
    supabase.auth.getUser().then((user) => {
      if (user.data.user === null) {
        return alert("ログインしてください");
      }
      setUserId(user.data.user.id);
    });
  }, []);

  // 画像を全てリストする関数
  const listAllImage = async () => {
    const tempUrlList: string[] = []; // 一時的なURLリスト
    // setLoadingState("flex justify-center"); // ローディング状態を表示

    console.log("fetching image list: ", user_id);
    // Supabaseから画像リストを取得
    const { data, error } = await supabase
      .storage
      .from(`public-image-bucket`)
      .list(`img/${user_id}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.log(error); // エラーが発生した場合、コンソールにログを出力
      return;
    }

    // 空のフォルダーを除外し、URLリストを作成
    for (let index = 0; index < data.length; index++) {
      if (data[index].name != ".emptyFolderPlaceholder") {
        tempUrlList.push(data[index].name);
      }
    }
    setUrlList(tempUrlList); // 画像URLリストをステートに設定
    await fetchAllComments(tempUrlList); // コメントを取得
    // setLoadingState("hidden"); // ローディング状態を隠す
  };

  // 画像に関連する全てのコメントを取得する関数
  const fetchAllComments = async (imageList: string[]) => {
    const tempComments: { [key: string]: { comment: string; created_at: string; event_date: string }[] } = {};
    for (const image of imageList) {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq('id', user_id);

      if (error) {
        console.log(error);
        continue;
      }

      tempComments[image] = data.map((entry: { comment: string; created_at: string; event_date: string }) => ({
        comment: entry.comment,
        created_at: entry.created_at,
        event_date: entry.event_date,
      }));
    }
    setComments(tempComments); // ステートに設定
  };

  // コンポーネントがマウントされたときに画像リストを取得
  useEffect(() => {
    if (user_id === "") {
      return;
    }
    (async () => {
      await listAllImage();
    })();
  }, [user_id]);

  // ファイル選択時に呼ばれる関数
  const handleChangeFile = (e: any) => {
    if (e.target.files.length !== 0) {
      setFile(e.target.files[0]); // 選択されたファイルをステートに設定
    }
  };

  // HEICファイルをJPEGに変換する関数
  const convertHeicToJpeg = async (file: File): Promise<Blob | null> => {
    try {
      const outputBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
      });
      if (Array.isArray(outputBlob)) {
        return outputBlob[0];
      }

      return outputBlob;
    } catch (error) {
      console.error("HEIC to JPEG conversion error:", error);
      return null;
    }
  };

  // フォーム送信時に呼ばれる関数
  const onSubmit = async (event: any) => {
    setLoadingState(true); // ローディング状態を表示
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    if (!file) {
      alert("ファイルを選択してください。"); // ファイルが選択されていない場合の警告
      return;
    }

    if (!comment.trim()) {
      setLoadingState(false);
      setErrorMessage("コメントは必須です。"); // コメントが入力されていない場合のエラーメッセージ
      return;
    }




    // setLoadingState("flex justify-center"); // ローディング状態を表示
    // setErrorMessage(""); // エラーメッセージをクリア
    // setIsButtonDisabled(true); // ボタンを無効化

    const fileExtension = file.name.split(".").pop(); // ファイル拡張子を取得
    const fileName = `${uuidv4()}.${fileExtension}`; // 一意なファイル名を生成

    let uploadFile = file; // アップロードするファイルを初期化

    // HEICファイルの場合、JPEGに変換
    if (file.type === "image/heic" || file.type === "image/heif") {
      const convertedBlob = await convertHeicToJpeg(file);
      if (convertedBlob) {
        uploadFile = new File([convertedBlob], `${uuidv4()}.jpeg`, { type: "image/jpeg" }); // 変換したJPEGを新しいファイルとして生成
      } else {
        alert("HEICファイルの変換に失敗しました。");
        setLoadingState(false); // ローディング状態を隠す
        // setIsButtonDisabled(false); // 失敗時にボタンを再度有効化
        return;
      }
    }

    // Supabaseに画像をアップロード
    const { error: uploadError } = await supabase.storage
      .from("public-image-bucket")
      .upload(`img/${user_id}/${uploadFile.name}`, uploadFile);
    if (uploadError) {
      alert("エラーが発生しました：" + uploadError.message); // アップロードエラーの警告
      setLoadingState(false); // ローディング状態を隠す
      // setIsButtonDisabled(false); // 失敗時にボタンを再度有効化
      return;
    }

    // コメントをデータベースに保存
    const { error: commentError } = await supabase
      .from("comments")
      .insert([{
        image_name: uploadFile.name,
        comment,
        created_at: new Date(),

        event_date: eventDate || new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }), // 日付 追加
        user_id: user_id, 
        latitude: lat,
        longitude: lng,
      }]); // 日付も追加

    if (commentError) {
      alert("コメントの保存中にエラーが発生しました：" + commentError.message); // コメント保存エラーの警告
      setLoadingState(false); // ローディング状態を隠す
      // setIsButtonDisabled(false); // 失敗時にボタンを再度有効化
      return;
    }

    // ステートをリセットし、再度画像リストを取得
    setFile(undefined);
    setComment("");
    await listAllImage();
    // setLoadingState("flex justify-center"); // ローディング状態を隠す

    // 投稿が完了した後に遷移
    router.push('/private'); // 遷移先のパスを指定
  };

  return (
    <>
      {/* 画像アップロードフォーム */}
      {loadingState ? (
      <div  aria-label="読み込み中">
        <h2>loading...</h2>
      </div>
      ):
      <div  aria-label="読み込み中">
        <form className="appload" onSubmit={onSubmit}>
          <input
            className="handler"
            type="file"
            id="formFile"
            accept="image/*,.HEIC"
            onChange={handleChangeFile} // ファイル選択時のハンドラ
          />
          <Stack spacing={1.5} sx={{ minWidth: 300 }}>
            <Input
              type="date"
              onChange={(e) => setEventDate(e.target.value)}
              slotProps={{
                input: {
                  min: '1930-01-01',
                  max: '2100-12-31',
                },
              }}
            />
          </Stack>
          <Textarea
            className="comment"
            placeholder="Enter your comment"
            minRows={6}
            sx={{
              '--Textarea-focusedInset': 'var(--any, )',
              '--Textarea-focusedThickness': '0.25rem',
              '--Textarea-focusedHighlight': 'rgba(13,110,253,.25)',
              '&::before': {
                transition: 'box-shadow .15s ease-in-out',
              },
              '&:focus-within': {
                borderColor: '#86b7fe',
              },
            }}
            value={comment} // コメントの値
            onChange={(e) => setComment(e.target.value)} // コメント入力時のハンドラー
          />
          {/* エラーメッセージの表示 */}
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <button type="submit" disabled={!file} className="send">
            送信
          </button>
        </form>
        {/* 画像とコメントの表示 */}
      </div>}
    </>
  );
}
