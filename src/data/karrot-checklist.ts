import type { ChecklistPhase } from "./facebook-checklist";

export const karrotChecklist: ChecklistPhase[] = [
  {
    id: "karrot-prep",
    title: "Phase 1: 준비 단계",
    description: "CPA 제휴마케팅 시작 전 세팅",
    items: [
      {
        id: "karrot-cpa-signup",
        label: "CPA 플랫폼 가입",
        description: "에어CPA, 디비센스, 애드팟 등",
      },
      {
        id: "karrot-merchant-select",
        label: "머천트(오퍼) 선택",
        description:
          "건당 단가, 승인형/확정형, 진행가능매체 확인",
      },
      {
        id: "karrot-biz-account",
        label: "당근비즈니스 계정 생성",
        description: "business.daangn.com에서 사업자등록번호로 가입",
      },
      {
        id: "karrot-biz-profile",
        label: "비즈프로필 생성",
        description: "가게 정보, 사진, 영업시간, 소개글 꼼꼼히 작성",
      },
      {
        id: "karrot-cash-charge",
        label: "당근 광고 캐시 충전",
        description: "선불 충전 방식. 소액(10~30만원)부터. 캐시 환불 불가 주의!",
      },
      {
        id: "karrot-pixel-setup",
        label: "전환 추적 코드(픽셀) 설정",
        description: "광고도구 > 전환추적관리에서 설정",
      },
      {
        id: "karrot-landing-check",
        label: "랜딩페이지 확인",
        description: "CPA 제공 랜딩 or 디비카트로 자체 제작",
      },
      {
        id: "karrot-landing-review",
        label: "랜딩페이지 소재 사전검수 요청",
        description: "CPA 플랫폼에 검수 필수. 검수 통과 후 광고 집행 가능",
      },
    ],
  },
  {
    id: "karrot-setup",
    title: "Phase 2: 광고 세팅",
    description: "캠페인 생성 및 소재 등록",
    items: [
      {
        id: "karrot-benchmark",
        label: "벤치마킹 자료 수집",
        description: "당근 피드에서 경쟁 광고 스크린샷",
      },
      {
        id: "karrot-creatives",
        label: "광고 소재 3~5개 제작",
        description: "실사 이미지 + 당근 톤의 카피",
      },
      {
        id: "karrot-campaign-create",
        label: "캠페인 생성",
        description: "네이티브 광고 / 앱·웹사이트 방문 유도하기",
      },
      {
        id: "karrot-adgroup-setup",
        label: "광고그룹 설정",
        description: "AI 타겟팅 최적화 or 오디언스 개별 설정",
      },
      {
        id: "karrot-bid-setup",
        label: "입찰 방식 설정",
        description: "CPC 수동 입찰 100원부터 시작 권장",
      },
      {
        id: "karrot-budget-setup",
        label: "일 예산 설정",
        description: "최소 11,000원 이상",
      },
      {
        id: "karrot-submit-review",
        label: "광고 심사 제출",
        description: "보통 24시간 이내 심사 완료. 거절 시 수정 후 재제출",
      },
    ],
  },
  {
    id: "karrot-creative-opt",
    title: "Phase 3: 소재 최적화 (1~2주차)",
    description: "데이터 기반 소재 테스트",
    items: [
      {
        id: "karrot-24h-wait",
        label: "24시간 세팅 변경 금지",
        description: "라이브 후 최소 24시간 대기",
      },
      {
        id: "karrot-data-check",
        label: "2~3일 데이터 확인",
        description: "소재별 CTR/CPC/광고비 소진 비교",
      },
      {
        id: "karrot-winner-creative",
        label: "승자 소재 확인",
        description: "광고비 가장 많이 소진 + CTR 높은 소재",
      },
      {
        id: "karrot-loser-fix",
        label: "패배 소재 카피 수정",
        description: "이미지 유지, 제목만 변경해서 재테스트",
      },
      {
        id: "karrot-copy-variation",
        label: "소재 변형 테스트 반복",
        description: "승자 소재 기준으로 카피 10회 이상 변형",
      },
      {
        id: "karrot-time-analysis",
        label: "노출 시간대 분석",
        description: "DB 발생 시간대 확인 후 전환 없는 시간대 제외",
      },
    ],
  },
  {
    id: "karrot-target-opt",
    title: "Phase 4: 타겟팅 최적화 (3~4주차)",
    description: "타겟 세분화로 효율 극대화",
    items: [
      {
        id: "karrot-winner-confirm",
        label: "승자 소재 확정",
      },
      {
        id: "karrot-targeting-test",
        label: "광고그룹 타겟팅 테스트",
        description: "AI 타겟팅 vs 오디언스 개별 설정 비교",
      },
      {
        id: "karrot-area-split",
        label: "(지역 기반 오퍼) 지역별 광고그룹 분리 테스트",
      },
      {
        id: "karrot-age-split",
        label: "(지역 확정 후) 연령대별 광고그룹 분리 테스트",
      },
      {
        id: "karrot-budget-opt",
        label: "캠페인 예산 최적화 활용",
        description: "새 캠페인에서 ON 후 그룹 간 자동 배분",
      },
    ],
  },
  {
    id: "karrot-scaleup",
    title: "Phase 5: 스케일업",
    description: "수익 안정화 후 확장",
    items: [
      {
        id: "karrot-budget-increase",
        label: "일 예산 증액",
        description: "수익 안정화 확인 후 단계적 증액",
      },
      {
        id: "karrot-new-merchant",
        label: "새 머천트 추가",
        description: "다른 오퍼로 동일 프로세스 반복",
      },
      {
        id: "karrot-dbcart-integration",
        label: "디비카트 연동",
        description: "자체 랜딩페이지로 픽셀 추적 정밀화",
      },
    ],
  },
];
