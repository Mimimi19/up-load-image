import './style.css';

export default function Help() {
    return(
    <div className="container">
        <h2 className="custom-heading">ヘルプページ</h2>

        <ul className="main">ログインについて</ul>
        <ul>
            <li className="text-center">このサイトはログインが<span className="highlight">必須条件</span>になっています。</li>
            <li className="text-center">ログインされない場合は利用できません。</li>
            <li className="text-center">ログインにはGoogleアカウントを使用しています。</li>
        </ul>

        <ul className="main">投稿について</ul>
        <ul>
            <li className="text-center">投稿ページでは投稿する写真や画像の選択・日付・コメントが入力できます。</li>
            <li className="text-center">イベント日付は選択されなかった場合、自動的に投稿日時が入力されます。</li>
            <li className="text-center">投稿が完了すると自動的にNew Postにページに画面遷移します。</li>
        </ul>

        <ul className="main">写真の選択について</ul>
        <ul>
            <li className="text-center">ここでは<span className="highlight">画像・写真ファイルのみ</span>アップロードができます。</li>
            <li className="text-center">それ以外のファイルはアップロードができませんのでご注意ください。</li>
            <li className="text-center">またファイル名に半角の英数字以外が含まれているとアップロードができない場合があります。</li>
            <li className="text-center">その場合はファイル名を変更して再度アップロードしなおしてください。</li>
        </ul>
        
    </div>
    );
}
