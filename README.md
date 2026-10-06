# CV TECH SUMMIT

상용차 기술 서밋을 위한 반응형 웹사이트 디자인 콘셉트입니다. 실제 행사 공지나 참가 신청 페이지가 아닙니다.

## 실행

저장소를 다운로드한 뒤 루트 폴더에서 실행합니다.

```sh
python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 을 엽니다. Node.js나 별도 빌드 없이 포함된 번들로 실행할 수 있습니다. `index.html`을 직접 열 수도 있으나 브라우저의 로컬 파일 정책에 따라 로컬 서버가 필요할 수 있습니다.

## 구성

- `index.html`, `styles.css`, `script.js`: 페이지와 반응형 레이아웃
- `intro.js`: 바로 실행할 수 있는 Three.js 번들
- `source/src/`: 수정 가능한 3D 인트로 소스
- `assets/hero-titanium-curve.png`: 시작 화면 및 WebGL 실패 시 대체 이미지
- `licenses/three-LICENSE.txt`: Three.js MIT 라이선스

## 3D 인트로

Three.js 0.180.0 기반 실시간 금속 곡면과 스튜디오 조명, 4.2초 카메라 리빌을 사용합니다. Pause motion과 Replay intro 버튼을 지원합니다. 동작 줄이기 설정 시 정지 상태로 시작하며, WebGL 사용이 불가능하면 대체 이미지를 표시합니다. 실행 시 외부 CDN, 영상 API 또는 외부 3D 모델이 필요하지 않습니다.

## 수정 및 빌드

Node.js와 npm이 설치된 환경에서:

```sh
cd source
npm ci
npm run build
```

빌드하면 루트의 `intro.js`가 갱신됩니다. 의존성 버전은 `source/package-lock.json`에 고정되어 있습니다.

## 검증 범위

소스 구문, 번들, 지오메트리, 파일 구성과 동작 제어 모의 테스트를 수행했습니다. 실제 GPU 렌더링과 로컬 파일 더블클릭 실행의 시각 검증은 아직 하지 않았습니다.

## 라이선스

포함된 Three.js는 MIT 라이선스이며 전문은 `licenses/three-LICENSE.txt`에 있습니다. 이 저장소의 디자인과 이미지에 별도 오픈소스 라이선스를 부여하지 않습니다.
