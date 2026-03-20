/**
 * 한빔한복 지점 안내 및 네이버 지도 로직 (최적화 버전)
 */
const branches = [
    {name:"부산점", phone:"051-634-2325", addr:"부산 동구 조방로 123", reserve:"https://m.booking.naver.com/booking/6/bizes/661812", kakao:"https://open.kakao.com/o/soq7Ns4d", lat:35.1381, lng:129.0621},
    {name:"센텀점", phone:"010-3052-2325", addr:"부산 해운대구 센텀중앙로 78", reserve:"https://booking.naver.com/booking/6/bizes/1577219", kakao:"https://open.kakao.com/o/sz1xltbi", lat:35.1742, lng:129.1275},
    {name:"김해점", phone:"010-8065-2325", addr:"경남 김해시 김해대로 2325", reserve:"https://booking.naver.com/booking/6/bizes/1402679", kakao:"https://open.kakao.com/o/sHM2wwsh", lat:35.2285, lng:128.8781},
    {name:"창원점", phone:"055-263-2325", addr:"경남 창원시 성산구 상남로 12", reserve:"https://booking.naver.com/booking/6/bizes/843111", kakao:"https://open.kakao.com/o/sdcvbh5e", lat:35.2211, lng:128.6834},
    {name:"양산점", phone:"055-912-0425", addr:"경남 양산시 물금읍 청운로", reserve:"https://booking.naver.com/booking/13/bizes/868629", kakao:"https://open.kakao.com/o/sp44Hxaf", lat:35.3282, lng:129.0145},
    {name:"진주점", phone:"010-5654-2407", addr:"경남 진주시 강남로 231", reserve:"https://m.booking.naver.com/booking/6/bizes/1485854", kakao:"https://open.kakao.com/o/sbxBToNh", lat:35.1834, lng:128.0872},
    {name:"인천점", phone:"032-283-2325", addr:"인천 남동구 인하로 497-15", reserve:"https://m.booking.naver.com/booking/13/bizes/1039475", kakao:"https://open.kakao.com/o/sIrXajUf", lat:37.4442, lng:126.7025},
    {name:"안산점", phone:"010-6591-2322", addr:"경기 안산시 단원구 고잔로 108", reserve:"https://m.booking.naver.com/booking/6/bizes/1500008", kakao:"https://open.kakao.com/o/sqRSjaRh", lat:37.3162, lng:126.8302},
    {name:"마산점", phone:"010-8832-2325", addr:"경남 창원시 마산회원구 양덕로", reserve:"https://booking.naver.com/booking/6/bizes/1526541", kakao:"https://open.kakao.com/o/ssWvuvYh", lat:35.2341, lng:128.5834},
    {name:"울산점", phone:"010-9807-2325", addr:"울산 남구 삼산로 273", reserve:"https://booking.naver.com/booking/6/bizes/1534767", kakao:"https://open.kakao.com/o/sKjCbA0h", lat:35.5392, lng:129.3352},
    {name:"대구점", phone:"010-8492-2328", addr:"대구 중구 달구벌대로 2141", reserve:"https://m.place.naver.com/place/2043617700/ticket", kakao:"https://open.kakao.com/o/sqPdeNfi", lat:35.8642, lng:128.5931}
];

let mapObj = null; // 지도 객체 전역 관리
let marker = null; // 마커 객체 전역 관리

function renderS(idx) {
    const listEl = document.getElementById('branchList');
    const detailEl = document.getElementById('branchDetail');
    const b = branches[idx];

    if(!listEl || !detailEl) return;

    // 1. 왼쪽 지점 리스트 업데이트 (활성화 표시)
    listEl.innerHTML = branches.map((item, i) => `
        <div class="branch-item ${i === idx ? 'active' : ''}" onclick="renderS(${i})">
            <h3>${item.name}</h3>
        </div>
    `).join('');

    // 2. 우측 상세 정보 업데이트 (지도를 제외한 나머지 텍스트/버튼)
    detailEl.innerHTML = `
        <div class="biz-card">
            <h2>한빔한복 ${b.name}</h2>
            <div class="info-row"><span class="info-lbl">위치</span><span>${b.addr}</span></div>
            <div class="info-row"><span class="info-lbl">전화</span><span>${b.phone}</span></div>
        </div>
        <div class="btn-row">
            <a href="tel:${b.phone}" class="btn btn-navy">전화걸기</a>
            <a href="${b.kakao}" target="_blank" class="btn btn-kakao">카톡상담</a>
            <a href="${b.reserve}" target="_blank" class="btn btn-green">네이버예약</a>
            <a href="https://map.naver.com/v5/search/${encodeURIComponent('한빔한복 ' + b.name)}" target="_blank" class="btn btn-gold">위치 공유</a>
        </div>
    `;

    // 3. 네이버 지도 이동 및 마커 업데이트
    const p = new naver.maps.LatLng(b.lat, b.lng);

    if (!mapObj) {
        // 지도가 아직 생성되지 않았을 때 (첫 실행 시)
        mapObj = new naver.maps.Map('naverMap', {
            center: p,
            zoom: 16
        });
        marker = new naver.maps.Marker({
            position: p,
            map: mapObj
        });
    } else {
        // 지도가 이미 있으면 중심점과 마커 위치만 이동 (깜빡임 없음)
        mapObj.setCenter(p);
        marker.setPosition(p);
    }
}
