import './createInfoWindowContent.css';

const createInfoWindowContent = (lat: number, lng: number): string => {
    // URLを生成
    const url = `/postDetail?lat=${lat}&lng=${lng}`;
    return `
        <div class="custom-info">
            <div class="custom-info-item coordinates">
                緯度: ${lat}<br>経度: ${lng}
            </div>
            <div class="toukou"> 
                <a href="${url}" target="_blank">Post</a>
            </div>
        </div>`;
};

export default createInfoWindowContent;
