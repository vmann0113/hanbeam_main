/**
 * 한빔한복 지점 안내 및 네이버 지도 로직
 */
let mapObj = null; 
let marker = null;

function renderS(idx) {
    const b = branches[idx];
    const listEl = document.getElementById('branchList');
    const infoBox = document.getElementById('branchInfoBox');
    const mapContainer = document.getElementById('naverMap');

    if(!listEl || !infoBox || !mapContainer) return;

    // 1. 왼쪽 리스트 활성화 UI 처리
    listEl.innerHTML = branches.map((item, i) => `
        <div class="branch-item ${i === idx ? 'active' : ''}" onclick="renderS(${i})">
            <h3>${item.name}</h3>
        </div>
    `).join('');

    // 2. 우측 상세 정보(텍스트+버튼)만 업데이트
    infoBox.innerHTML = `
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

    // 3. 네이버 지도 초기화 및 이동
    const p = new naver.maps.LatLng(b.lat, b.lng);

    if (!mapObj) {
        // 처음 실행 시 지도 생성
        mapObj = new naver.maps.Map(mapContainer, {
            center: p,
            zoom: 16,
            // 모바일에서 지도가 잘리거나 쏠리는 현상 방지
            size: new naver.maps.Size(mapContainer.offsetWidth, 450) 
        });
        marker = new naver.maps.Marker({
            position: p,
            map: mapObj
        });
    } else {
        // 이미 생성된 경우 위치만 이동
        mapObj.setCenter(p);
        marker.setPosition(p);
        // 레이아웃 깨짐 방지를 위한 사이즈 재계산
        mapObj.autoResize(); 
    }
}
