import PrivateImageApp from '../../components/privateImageApp';
import './style.css'; // スタイルシートをインポート


export default function Index() {
  return (
    <>
      <h2 className = "custom-heading">My Post</h2>
      <div className="scroll-container">
        <PrivateImageApp />
      </div>
    </>
  );
}
