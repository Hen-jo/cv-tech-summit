CV TECH SUMMIT — Real-time titanium intro

index.html을 열어 확인할 수 있도록 로컬 파일과 일반 스크립트로 묶었습니다.
실제 WebGL 렌더링과 파일 더블클릭 실행은 이 작업 환경에서 시각 검증하지 못했습니다.
브라우저가 로컬 실행을 제한하면 이 폴더를 로컬 웹 서버로 제공해 주세요.

첫 화면: Three.js 기반 실시간 금속 곡면, 조명 반사, 4.2초 카메라 리빌.
Pause motion: 움직임 일시 정지 / 재개.
Replay intro: 인트로 다시 보기. 키보드와 터치 지원.
동작 줄이기 설정 시 정지 3D 화면으로 시작하며 버튼으로 움직임을 켤 수 있습니다.
WebGL 실패 시 기존 정지 이미지와 '정지 이미지 모드' 안내를 표시합니다.
기존 소개, 테마, 프로그램, 안내 영역은 보존했습니다.

CDN, 외부 3D 모델, 외부 HDR, 유료 영상 API를 사용하지 않습니다.
Three.js MIT 라이선스: licenses/three-LICENSE.txt
수정 가능한 소스: source/src/*.mjs
소스 빌드: source 폴더에서 npm ci, npm run build (상위 폴더의 intro.js를 갱신합니다).
검증: 코드 구문/번들, 지오메트리, 로컬 파일, 동작 제어 모의 테스트. GPU 시각 검증 제외.
