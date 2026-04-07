import type { ChecklistPhase } from "./facebook-checklist";

export const karrotChecklist: ChecklistPhase[] = [
  {
    id: "karrot-setup",
    title: "1. 당근비즈니스 준비",
    description: "광고 시작 전 기본 세팅",
    items: [
      {
        id: "karrot-biz-account",
        label: "당근비즈니스 계정 생성",
        description:
          "당근앱 > 나의 당근 > 광고에서 약관 동의. 사업자등록번호 필수!",
      },
      {
        id: "karrot-biz-profile",
        label: "비즈프로필 만들기",
        description:
          "내 가게/서비스 소개 페이지. 광고 클릭 시 랜딩 역할을 하므로 필수",
      },
      {
        id: "karrot-biz-profile-complete",
        label: "비즈프로필 완성도 높이기",
        description:
          "가게 사진, 영업시간, 위치, 메뉴/서비스 설명, 연락처 전부 채우기",
      },
      {
        id: "karrot-biz-posts",
        label: "비즈프로필에 소식 글 2~3개 올리기",
        description:
          "빈 프로필에 광고 유입되면 이탈률 높음. 후기, 이벤트, 소개 글 미리 올려두기",
      },
      {
        id: "karrot-mode-select",
        label: "광고 모드 결정 (간편모드 vs 전문가모드)",
        description:
          "초보자는 간편모드 추천. 입찰가/예산 세밀 조절 필요하면 전문가모드",
      },
    ],
  },
  {
    id: "karrot-research",
    title: "2. 타겟 & 벤치마킹",
    description: "동네 기반 타겟 전략 짜기",
    items: [
      {
        id: "karrot-target-area",
        label: "핵심 타겟 동네 선정",
        description:
          "내 가게 반경 1~5km. 여러 동을 선택 가능. 너무 넓게 잡지 말 것",
      },
      {
        id: "karrot-target-demo",
        label: "타겟 연령/성별 결정",
        description: "예: 20~40대 여성 (헬스장), 30~50대 전체 (자동차 정비)",
      },
      {
        id: "karrot-competitor-check",
        label: "당근에서 같은 업종 경쟁사 광고 확인",
        description:
          "당근 피드에서 내 업종 광고가 어떻게 나오는지 직접 확인",
      },
      {
        id: "karrot-bench-copy",
        label: "잘 되는 광고 문구 벤치마킹",
        description:
          "반응 좋은 주제: 체험권, 할인, 전문성 어필, 성공사례/후기",
      },
      {
        id: "karrot-bench-image",
        label: "경쟁사 광고 이미지 스타일 분석",
        description: "실제 매장 사진 vs 디자인 이미지, 텍스트 포함 여부 등",
      },
      {
        id: "karrot-landing-decide",
        label: "광고 클릭 시 도착 페이지 결정",
        description:
          "비즈프로필 / 외부 웹사이트 / 전화 연결 중 선택",
      },
    ],
  },
  {
    id: "karrot-creative",
    title: "3. 광고 소재 제작",
    description: "당근에 맞는 소재 만들기",
    items: [
      {
        id: "karrot-image-size",
        label: "이미지 규격 확인 후 제작",
        description:
          "권장 사이즈: 1200x628px (1.91:1). 파일 최대 5MB. 텍스트 비율 20% 이하 권장",
      },
      {
        id: "karrot-image-local",
        label: "동네 느낌나는 소재 준비",
        description:
          "당근은 로컬 플랫폼! 실제 매장 사진, 동네 이름 언급이 CTR 높음",
      },
      {
        id: "karrot-headline",
        label: "광고 제목(헤드라인) 작성",
        description:
          "25자 이내 권장. 핵심 혜택을 앞에. 예: '강남역 3분! 첫 달 50% 할인'",
      },
      {
        id: "karrot-description",
        label: "광고 설명문 작성",
        description:
          "40자 이내 권장. 행동 유도 포함. 예: '지금 예약하면 체험권 무료 증정'",
      },
      {
        id: "karrot-cta",
        label: "행동 유도 버튼 선택",
        description: "자세히 보기 / 전화하기 / 길찾기 / 예약하기 등",
      },
      {
        id: "karrot-ab-creatives",
        label: "소재 2~3개 준비 (AB 테스트용)",
        description:
          "같은 상품이라도 다른 이미지/문구로 최소 2개. 10개 이상 카피 테스트 추천",
      },
    ],
  },
  {
    id: "karrot-setting",
    title: "4. 캠페인 세팅",
    description: "광고 관리자에서 세팅하기",
    items: [
      {
        id: "karrot-campaign-goal",
        label: "캠페인 목표 선택",
        description:
          "비즈프로필 방문 / 웹사이트 방문 유도 / 앱 설치 / 전화 유도 등",
      },
      {
        id: "karrot-campaign-name",
        label: "캠페인 이름 입력",
        description: "날짜 + 목적으로 구분. 예: '0407_헬스장_체험권'",
      },
      {
        id: "karrot-placement",
        label: "노출 위치 선택",
        description:
          "홈 피드 (네이티브) / 검색 결과 / 더보기 탭 등. 홈 피드가 가장 노출 많음",
      },
      {
        id: "karrot-area-setting",
        label: "타겟 지역(동네) 설정",
        description:
          "가장 중요! 우리 가게 주변 동네를 구체적으로 여러 개 선택. 읍/면/동 단위",
      },
      {
        id: "karrot-demo-setting",
        label: "연령/성별 타겟 설정",
        description: "전문가모드에서 세밀 설정 가능",
      },
      {
        id: "karrot-budget",
        label: "일일 예산 설정",
        description:
          "최소 일일 예산 확인. 소규모 테스트는 1~3만원/일 추천",
      },
      {
        id: "karrot-bid",
        label: "입찰 방식 설정",
        description:
          "자동 입찰 (클릭수 최대화) vs 수동 입찰 (CPC 직접 설정). 최소 CPC 약 200원. 초보는 자동 추천",
      },
      {
        id: "karrot-schedule",
        label: "광고 기간/일정 설정",
        description: "시작일~종료일. 최소 1주일 이상 돌리는 것 추천",
      },
      {
        id: "karrot-creative-upload",
        label: "광고 소재 등록",
        description: "앞서 준비한 이미지 + 제목 + 설명문 + CTA 업로드",
      },
      {
        id: "karrot-preview",
        label: "광고 미리보기 확인",
        description:
          "이웃에게 어떻게 보이는지 확인. 잘림 없는지, 텍스트 읽히는지 체크",
      },
    ],
  },
  {
    id: "karrot-review",
    title: "5. 심사 & 집행",
    description: "심사 통과하고 광고 시작하기",
    items: [
      {
        id: "karrot-policy-check",
        label: "광고 정책 위반사항 자체 점검",
        description:
          "과장 광고, 허위 후기, 사행성, 성인 콘텐츠, 의료법 위반 등 금지",
      },
      {
        id: "karrot-submit-review",
        label: "심사 요청 제출",
        description: "보통 24시간 이내 완료. 결과는 당근 채팅으로 알림",
      },
      {
        id: "karrot-review-result",
        label: "심사 결과 확인",
        description:
          "거절 시 사유 확인 후 소재 수정 → 재심사. 반복 거절 시 정책 재확인",
      },
      {
        id: "karrot-payment-setup",
        label: "광고캐시 충전 (선불)",
        description:
          "당근은 선불 캐시 충전 방식. 소액(10~30만원)부터 시작. 캐시 환불 불가 주의!",
      },
      {
        id: "karrot-go-live",
        label: "광고 집행 시작!",
        description: "심사 승인 후 설정한 일정에 맞춰 자동 시작",
      },
    ],
  },
  {
    id: "karrot-optimize",
    title: "6. 성과 분석 & 최적화",
    description: "데이터 보면서 개선하기",
    items: [
      {
        id: "karrot-check-metrics",
        label: "핵심 지표 확인 (노출수, 클릭수, CTR, CPC)",
        description:
          "매일 확인. CTR 1% 이상 양호. CPC 평균 300~600원 (서울/경기 기준)",
      },
      {
        id: "karrot-compare-creatives",
        label: "소재별 성과 비교",
        description:
          "AB 테스트 결과 확인. 클릭 많은 소재에 예산 집중",
      },
      {
        id: "karrot-area-optimize",
        label: "지역별 성과 분석",
        description:
          "특정 동네에서 반응 좋으면 해당 지역 예산 증액. 당근의 핵심 장점 활용",
      },
      {
        id: "karrot-refresh-creative",
        label: "소재 주기적 교체 (2주마다)",
        description:
          "같은 소재 오래 쓰면 피로도 상승. 새 이미지/문구로 신선하게",
      },
      {
        id: "karrot-budget-adjust",
        label: "예산 조절",
        description:
          "성과 좋으면 일일 예산 점진적 증액. 한번에 크게 올리지 말 것",
      },
      {
        id: "karrot-biz-profile-update",
        label: "비즈프로필 소식 업데이트",
        description:
          "광고로 유입된 이웃이 볼 콘텐츠 꾸준히 관리. 후기/이벤트 올리기",
      },
      {
        id: "karrot-conversion-track",
        label: "실제 전환 추적 (전화, 방문, 예약)",
        description:
          "광고 보고 전화/방문한 고객 수 수동 기록. 당근은 전환 API 없으므로 직접 체크",
      },
    ],
  },
];
