export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

export interface ChecklistPhase {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

export const facebookChecklist: ChecklistPhase[] = [
  {
    id: "target",
    title: "1. 타겟 조사",
    description: "누구한테 광고를 보여줄지 정하기",
    items: [
      {
        id: "target-product",
        label: "광고할 상품/서비스 선택",
        description: "에어CPA 강사, 제휴 사이트 상품 등",
      },
      {
        id: "target-age",
        label: "핵심 타겟 연령대 결정",
        description: "예: 30~50대",
      },
      {
        id: "target-gender",
        label: "핵심 타겟 성별 결정",
        description: "남성 / 여성 / 전체",
      },
      {
        id: "target-platform",
        label: "플랫폼 결정",
        description: "메타(페이스북+인스타) / 유튜브 / 당근",
      },
      {
        id: "target-cookie",
        label: "네이버/유튜브에서 관련 키워드 검색 (쿠키 쌓기)",
        description: "내 피드에 관련 광고가 뜨도록 검색 기록 남기기",
      },
    ],
  },
  {
    id: "benchmark",
    title: "2. 벤치마킹",
    description: "잘 되는 광고 찾아서 따라하기",
    items: [
      {
        id: "bench-feed",
        label: "피드에 관련 광고 뜨는지 확인",
        description: "쿠키 쌓은 후 2주~1달 대기",
      },
      {
        id: "bench-library",
        label: "메타 광고 라이브러리에서 경쟁사 검색",
        description: "광고 라이브러리에서 키워드로 검색",
      },
      {
        id: "bench-save",
        label: "좋아요/댓글 많은 광고 3~5개 저장",
        description: "반응 좋은 광고 = 벤치마킹 대상",
      },
      {
        id: "bench-copy",
        label: "광고 문구(카피) 벤치마킹 메모",
      },
      {
        id: "bench-creative",
        label: "광고 영상/이미지 스타일 벤치마킹",
      },
      {
        id: "bench-landing",
        label: "랜딩 페이지 구조 벤치마킹",
      },
      {
        id: "bench-pagename",
        label: "페이지 이름 결정 (벤치마킹 기반)",
        description: "내 생각 빼고, 잘 되는 걸 참고",
      },
    ],
  },
  {
    id: "content",
    title: "3. 페이지 & 콘텐츠 준비",
    description: "광고 소재 만들기",
    items: [
      {
        id: "content-page",
        label: "페이스북 페이지 만들기",
        description: "더보기 > 페이지 > 페이지 만들기 (이름 + 카테고리)",
      },
      {
        id: "content-script",
        label: "광고 영상 대본 작성 (ChatGPT)",
        description: "3번 돌려서 가장 괜찮은 거 선택",
      },
      {
        id: "content-video",
        label: "영상 제작 (부루/VO3)",
        description:
          "무음구간 0초, 자막 배경 노란색, 속도 1.25배, 위아래 후킹 텍스트",
      },
      {
        id: "content-image",
        label: "또는 이미지 광고 제작 (미리캔버스)",
        description: "스토리/릴스=세로, 피드=1:1",
      },
      {
        id: "content-copywrite",
        label: "광고 문구 작성 (벤치마킹 기반)",
      },
      {
        id: "content-landing",
        label: "랜딩 페이지 준비",
        description: "에어CPA 링크 또는 DB카트로 직접 제작",
      },
      {
        id: "content-privacy",
        label: "개인정보 수집 동의 폼 포함 확인",
        description: "안 넣으면 불법! 반드시 체크",
      },
    ],
  },
  {
    id: "payment",
    title: "4. 결제 수단 & 픽셀",
    description: "돈 연결하고 추적 코드 심기",
    items: [
      {
        id: "pay-kakao",
        label: "카카오페이 충전 (선불)",
        description: "신용카드 직접 등록하면 과금 위험! 카카오페이로",
      },
      {
        id: "pay-connect",
        label: "광고 관리자 > 청구 및 결제 > 카카오페이 연결",
      },
      {
        id: "pay-pixel",
        label: "픽셀(데이터세트) 생성",
        description: "이름은 아무거나 OK",
      },
      {
        id: "pay-pixel-install",
        label: "에어CPA/DB카트에 페이스북 픽셀 ID 설정",
        description: "이벤트 관리자에서 ID 복사 > 픽셀 설정에 붙여넣기",
      },
    ],
  },
  {
    id: "setting",
    title: "5. 광고 세팅",
    description: "드디어 광고 만들기",
    items: [
      {
        id: "set-campaign",
        label: "캠페인 만들기 > 잠재 고객 선택",
      },
      {
        id: "set-name",
        label: "캠페인 이름 입력 (날짜 형식 추천)",
      },
      {
        id: "set-budget",
        label: "1일 예산 설정 (추천: 3만원)",
        description: "캠페인 예산으로 설정",
      },
      {
        id: "set-conversion",
        label: "전환 위치: 웹사이트 선택",
      },
      {
        id: "set-event",
        label: "이벤트: 등록 완료 선택",
      },
      {
        id: "set-location",
        label: "타겟: 대한민국 + 한국어 설정",
        description: "언어 한국어 안 바꾸면 외국인 유입",
      },
      {
        id: "set-demo",
        label: "연령/성별 설정",
      },
      {
        id: "set-page",
        label: "페이지 선택",
      },
      {
        id: "set-url",
        label: "웹사이트 URL 입력",
      },
      {
        id: "set-browser",
        label: "브라우저 추구 기능 > 없음 체크",
      },
      {
        id: "set-creative",
        label: "광고 소재 업로드 (영상 또는 이미지)",
      },
      {
        id: "set-ab",
        label: "AB 테스트: 광고세트 3개 세팅",
        description:
          "캠페인 1개에 세트 3개 (각각 다른 영상+문구). 경매 시스템이 알아서 좋은 것에 예산 집중",
      },
      {
        id: "set-preview",
        label: "미리보기 확인 (FB/인스타 피드/스토리/릴스)",
      },
      {
        id: "set-publish",
        label: "광고 개시!",
      },
    ],
  },
  {
    id: "optimize",
    title: "6. 운영 & 최적화",
    description: "광고 돌리면서 관리하기",
    items: [
      {
        id: "opt-wait",
        label: "최소 1주일 돌리기 (최적화 대기)",
        description: "AI가 타겟을 찾아가는 시간 필요",
      },
      {
        id: "opt-weekend",
        label: "주말 광고 끄기 (필요시)",
        description: "페이스북은 수동으로 꺼야 함",
      },
      {
        id: "opt-cpa",
        label: "전환 단가 확인",
        description: "목표 단가 이하인지 체크 (예: DB당 11,000원 이하)",
      },
      {
        id: "opt-scale",
        label: "잘 나오는 세트에 예산 집중",
      },
      {
        id: "opt-keep",
        label: "안 나오는 세트 유지 (끄지 않기)",
        description: "노출은 되고 있으므로 간접 기여",
      },
      {
        id: "opt-limit",
        label: "광고 계정 한도 증가 확인",
        description: "20~30만원 사용 후 한도 상승",
      },
      {
        id: "opt-accounts",
        label: "추가 광고 계정 생성 (최대 10개)",
        description: "정지 대비 백업 계정",
      },
    ],
  },
];
