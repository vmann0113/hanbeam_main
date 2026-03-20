/**
 * 한빔한복 지점 안내 + 네이버 지도 안정형 버전
 * - 지도는 최초 1회만 생성
 * - 지점 클릭 시 센터/마커/정보만 변경
 * - 네이버 지도 API 로딩 타이밍 이슈 대비
 * - 양산점 제외
 */

const branches = [
    { name: "부산점", phone: "051-634-2325", addr: "부산 동구 조방로 123", reserve: "https://m.booking.naver.com/booking/6/bizes/661812", kakao: "https://open.kakao.com/o/soq7Ns4d", lat: 35.1381, lng: 129.0621 },
    { name: "센텀점", phone: "010-3052-2325", addr: "부산 해운대구 센텀중앙로 78", reserve: "https://booking.naver.com/booking/6/bizes/1577219", kakao: "https://open.kakao.com/o/sz1xltbi", lat: 35.1742, lng: 129.1275 },
    { name: "김해점", phone: "010-8065-2325", addr: "경남 김해시 김해대로 2325", reserve: "https://booking.naver.com/booking/6/bizes/1402679", kakao: "https://open.kakao.com/o/sHM2wwsh", lat: 35.2285, lng: 128.8781 },
    { name: "창원점", phone: "055-263-2325", addr: "경남 창원시 성산구 상남로 12", reserve: "https://booking.naver.com/booking/6/bizes/843111", kakao: "https://open.kakao.com/o/sdcvbh5e", lat: 35.2211, lng: 128.6834 },
    { name: "진주점", phone: "010-5654-2407", addr: "경남 진주시 강남로 231", reserve: "https://m.booking.naver.com/booking/6/bizes/1485854", kakao: "https://open.kakao.com/o/sbxBToNh", lat: 35.1834, lng: 128.0872 },
    { name: "인천점", phone: "032-283-2325", addr: "인천 남동구 인하로 497-15", reserve: "https://m.booking.naver.com/booking/13/bizes/1039475", kakao: "https://open.kakao.com/o/sIrXajUf", lat: 37.4442, lng: 126.7025 },
    { name: "안산점", phone: "010-6591-2322", addr: "경기 안산시 단원구 고잔로 108", reserve: "https://m.booking.naver.com/booking/6/bizes/1500008", kakao: "https://open.kakao.com/o/sqRSjaRh", lat: 37.3162, lng: 126.8302 },
    { name: "마산점", phone: "010-8832-2325", addr: "경남 창원시 마산회원구 양덕로", reserve: "https://booking.naver.com/booking/6/bizes/1526541", kakao: "https://open.kakao.com/o/ssWvuvYh", lat: 35.2341, lng: 128.5834 },
    { name: "울산점", phone: "010-9807-2325", addr: "울산 남구 삼산로 273", reserve: "https://booking.naver.com/booking/6/bizes/1534767", kakao: "https://open.kakao.com/o/sKjCbA0h", lat: 35.5392, lng: 129.3352 },
    { name: "대구점", phone: "010-8492-2328", addr: "대구 중구 달구벌대로 2141", reserve: "https://m.place.naver.com/place/2043617700/ticket", kakao: "https://open.kakao.com/o/sqPdeNfi", lat: 35.8642, lng: 128.5931 }
];

let mapObj = null;
let marker = null;
let infoWindow = null;
let currentIndex = 0;

/** 문자열 안전 처리 */
function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/** 네이버 지도 API 로딩 체크 */
function isNaverMapReady() {
    return typeof window.naver !== "undefined" &&
           window.naver.maps &&
           typeof window.naver.maps.Map === "function";
}

/** 목록 렌더 */
function renderBranchList(activeIdx) {
    const listEl = document.getElementById("branchList");
    if (!listEl) return;

    listEl.innerHTML = branches.map((item, i) => `
        <button type="button"
                class="branch-item ${i === activeIdx ? "active" : ""}"
                data-idx="${i}">
            <h3>${escapeHtml(item.name)}</h3>
        </button>
    `).join("");
}

/** 상세 영역 기본 뼈대 */
function ensureDetailShell() {
    const detailEl = document.getElementById("detailView");
    if (!detailEl) return false;

    if (!document.getElementById("naverMap")) {
        detailEl.innerHTML = `
            <div id="naverMap"
                 style="width:100%; height:450px; border-radius:12px; margin-bottom:30px; border:1px solid #ddd; background:#eee; overflow:hidden;">
            </div>
            <div id="branchInfoBox"></div>
        `;
    } else if (!document.getElementById("branchInfoBox")) {
        detailEl.insertAdjacentHTML("beforeend", `<div id="branchInfoBox"></div>`);
    }

    return true;
}

/** 정보 박스 렌더 */
function renderBranchInfo(idx) {
    const b = branches[idx];
    const infoBox = document.getElementById("branchInfoBox");
    if (!infoBox || !b) return;

    const shareUrl = `https://map.naver.com/v5/search/${encodeURIComponent("한빔한복 " + b.name)}`;

    infoBox.innerHTML = `
        <div class="biz-card">
            <h2>한빔한복 ${escapeHtml(b.name)}</h2>
            <div class="info-row">
                <span class="info-lbl">위치</span>
                <span>${escapeHtml(b.addr)}</span>
            </div>
            <div class="info-row">
                <span class="info-lbl">전화</span>
                <span>${escapeHtml(b.phone)}</span>
            </div>
        </div>

        <div class="btn-row">
            <a href="tel:${escapeHtml(b.phone)}" class="btn btn-navy">전화걸기</a>
            <a href="${escapeHtml(b.kakao)}" target="_blank" rel="noopener" class="btn btn-kakao">카톡상담</a>
            <a href="${escapeHtml(b.reserve)}" target="_blank" rel="noopener" class="btn btn-green">네이버예약</a>
            <a href="${shareUrl}" target="_blank" rel="noopener" class="btn btn-gold">위치 공유</a>
        </div>
    `;
}

/** 지도 생성 또는 갱신 */
function renderMap(idx) {
    const b = branches[idx];
    if (!b || !isNaverMapReady()) return;

    const mapEl = document.getElementById("naverMap");
    if (!mapEl) return;

    const point = new naver.maps.LatLng(b.lat, b.lng);

    if (!mapObj) {
        mapObj = new naver.maps.Map("naverMap", {
            center: point,
            zoom: 16
        });

        marker = new naver.maps.Marker({
            position: point,
            map: mapObj
        });

        infoWindow = new naver.maps.InfoWindow({
            content: `
                <div style="padding:10px 14px; font-size:14px; line-height:1.5;">
                    <strong>한빔한복 ${escapeHtml(b.name)}</strong><br>
                    <span>${escapeHtml(b.addr)}</span>
                </div>
            `
        });

        infoWindow.open(mapObj, marker);
    } else {
        mapObj.setCenter(point);
        marker.setPosition(point);

        if (infoWindow) {
            infoWindow.setContent(`
                <div style="padding:10px 14px; font-size:14px; line-height:1.5;">
                    <strong>한빔한복 ${escapeHtml(b.name)}</strong><br>
                    <span>${escapeHtml(b.addr)}</span>
                </div>
            `);
            infoWindow.open(mapObj, marker);
        }

        // 탭 전환 / display 변경 등으로 지도 컨테이너 크기 인식이 꼬인 경우 보정
        requestAnimationFrame(() => {
            if (mapObj && typeof mapObj.autoResize === "function") {
                mapObj.autoResize();
                mapObj.setCenter(point);
            }
        });
    }
}

/** 전체 렌더 */
function renderS(idx = 0) {
    currentIndex = idx;

    if (!ensureDetailShell()) return;

    renderBranchList(idx);
    renderBranchInfo(idx);

    if (!isNaverMapReady()) {
        const mapEl = document.getElementById("naverMap");
        if (mapEl) {
            mapEl.innerHTML = `
                <div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; color:#666; font-size:15px;">
                    지도를 불러오는 중입니다...
                </div>
            `;
        }
        return;
    }

    renderMap(idx);
}

/** 지도 API가 늦게 붙는 경우 재시도 */
function waitForNaverMapAndRender(idx = 0, maxTry = 40, delay = 200) {
    let count = 0;

    const timer = setInterval(() => {
        count += 1;

        if (isNaverMapReady()) {
            clearInterval(timer);
            renderS(idx);
            return;
        }

        if (count >= maxTry) {
            clearInterval(timer);
            const mapEl = document.getElementById("naverMap");
            if (mapEl) {
                mapEl.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; color:#c00; font-size:14px; text-align:center; padding:20px;">
                        네이버 지도 API를 불러오지 못했습니다.<br>
                        script 주소와 ncpKeyId 설정을 다시 확인해주세요.
                    </div>
                `;
            }
            console.error("네이버 지도 API 로딩 실패");
        }
    }, delay);
}

/** 목록 클릭 이벤트 위임 */
document.addEventListener("click", (e) => {
    const item = e.target.closest(".branch-item");
    if (!item) return;

    const idx = Number(item.dataset.idx);
    if (Number.isNaN(idx)) return;

    renderS(idx);
});

/** 초기 실행 */
document.addEventListener("DOMContentLoaded", () => {
    ensureDetailShell();

    if (isNaverMapReady()) {
        renderS(0);
    } else {
        waitForNaverMapAndRender(0);
    }
});

/** 필요 시 외부에서도 호출 가능하게 */
window.renderS = renderS;
