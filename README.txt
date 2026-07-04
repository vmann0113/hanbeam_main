한빔한복 홈페이지 — 배포 안내
================================

■ 구성 파일
  index.html            메인 페이지 (진입점)
  support.js            렌더 런타임 (반드시 index.html과 같은 위치)
  assets/web/           히어로·매장·룩북·악세사리 이미지
  assets/footer_logo.png  로고
  favicon.png / apple-touch-icon.png  파비콘
  og-image.jpg          카톡·SNS 공유 썸네일 (1200×630)
  robots.txt / sitemap.xml  검색엔진용
  * 브랜드 영상: assets/video/brand_video.mp4 경로로 연결되어 있음
    (기존 레포와 동일 경로). 해당 위치에 영상 파일을 두면 재생됩니다.

■ GitHub Pages 교체 방법 (vmann0113/hanbeam_main — 현재 라이브 레포)
  ★ 이 폴더에는 CNAME과 .nojekyll이 포함되어 있어, “레포 내용 전체 교체”만 하면 됩니다.

  [방법 A — GitHub 웹사이트, 비개발자 추천]
  1) 교체 전 백업: 레포 > Code > 초록색 Code 버튼 > Download ZIP
  2) 기존 파일 삭제: index.html, map-logic.js, test.html, assets/ 폴더를 삭제
     (CNAME은 이 폴더에도 들어있으니 구별 불필요)
  3) 이 deploy 폴더의 모든 파일을 드래그해 업로드 (Add file > Upload files) 후 Commit
  4) 1~2분 뒤 hanbeam.co.kr 자동 재배포 완료

  [방법 B — git 명령어]
     git clone → 기존 파일 삭제 → deploy 내용 복사 → git add -A && commit && push

  ※ CNAME(hanbeam.co.kr)은 절대 지우지 마세요 — 지우면 도메인 연결이 끊깁니다.
  ※ 브랜드 영상: assets/video/brand_video.mp4 경로에 영상 파일을 두면 재생됩니다.
     (기존 홈페이지와 동일 경로로 맞춤 — 기존 영상이 있으면 그대로 사용)
     1080p · H.264 · 40MB 이하 권장. GitHub은 파일당 100MB 제한.
     파일이 없으면 포스터(룩북 사진) 화면이 표시됩니다.
  ※ 주의: 예약센터 서브사이트(hbland_0426, /bs ·/cm 등)는 이 레포가 아니므로
     이 교체 작업과 무관합니다. 건들지 마세요.

■ 배포 후 필수 설정
  1) 네이버 지도: 이 도메인(hanbeam.co.kr 등)이 지도 API 키에 등록돼 있어야
     지도가 표시됩니다. (네이버 클라우드 콘솔 > Maps > 등록 도메인 확인)
  2) 검색 등록:
     - 네이버 서치어드바이저 / 구글 서치콘솔에 사이트 등록 후,
       발급받은 인증 코드를 index.html <head>의
       naver-site-verification / google-site-verification 값에 넣으세요.
     - sitemap.xml 제출.
  3) 카톡 공유 미리보기: 카카오는 캐시가 강해, 변경 시
     카카오디벨로퍼스 > 도구 > 캐시 초기화에서 URL을 갱신하세요.

■ 참고
  - 도메인/URL은 현재 https://hanbeam.co.kr 기준입니다.
    다른 주소로 배포하면 index.html의 canonical/og:url/og:image 및
    robots.txt·sitemap.xml의 주소를 함께 바꿔주세요.
  - 양산점 카톡 링크는 미확보 상태로 네이버 검색으로 임시 연결돼 있습니다.
  - 인천점 카톡 링크는 원본 저장소 기준(센텀점과 동일)으로 넣었습니다. 확인 필요.
