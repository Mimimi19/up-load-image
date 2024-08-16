import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function deleteRowById(id: string, user_id: string, image_name: string) {
    try {
        // Supabase の "comments" テーブルから指定された ID の行を削除
        const { data, error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id); // idが指定されたものと一致する行を削除

        if (error) {
            throw error; // エラーが発生した場合、エラーをスローしてキャッチブロックに移動
        }

        console.log('削除が成功しました:', data);

        // // ユーザーIDに基づいてフォルダ内のファイルを取得
        // const { data: files, error: listError } = await supabase.storage
        //     .from('public-image-bucket') // あなたのバケット名を指定
        //     .list(`${user_id}`); // ユーザーIDのフォルダを指定

        // if (listError) throw listError;

        // // ファイルのパスを設定
        // const filePaths = files.map(file => `${user_id}/${image_name}`);
        const filePaths = [`img/${user_id}/${image_name}`];

        // フォルダ内のファイルを削除
        const { error: deleteError } = await supabase.storage
            .from('public-image-bucket')
            .remove(filePaths);

        if (deleteError) {
            throw deleteError; // ファイル削除時のエラー処理
        }

        console.log('ファイル削除が成功しました');
    } catch (error) {
        console.error('削除に失敗しました:', (error as any).message);
    }
}
