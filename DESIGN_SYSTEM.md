# Ad-Checklist Design System Reference

당근마켓 CPA 제휴마케팅 앱 — 컴포넌트별 Tailwind 클래스 스펙.
globals.css의 CSS 변수와 함께 사용.

---

## 1. 컬러 시스템

### CSS 변수 사용 패턴
```tsx
// Tailwind v4에서 CSS 변수 사용
className="bg-[var(--color-karrot)]"
className="text-[var(--color-profit)]"
className="border-[var(--color-border-default)]"
```

### 흑자/적자 컬러링 함수
```tsx
// 수익 데이터 표시용
function getProfitColor(amount: number) {
  if (amount > 0) return {
    text: "text-[#16A34A]",
    bg: "bg-[#F0FDF4]",
    border: "border-[#BBF7D0]",
  };
  if (amount < 0) return {
    text: "text-[#DC2626]",
    bg: "bg-[#FEF2F2]",
    border: "border-[#FECACA]",
  };
  return {
    text: "text-[#78716C]",
    bg: "bg-[#F5F5F4]",
    border: "border-[#E7E5E4]",
  };
}
```

---

## 2. 타이포그래피

### 폰트 로딩 (layout.tsx head에 추가)
```tsx
// Pretendard — 한글 최적화 (CDN)
<link rel="preconnect" href="https://cdn.jsdelivr.net" />
<link
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
  rel="stylesheet"
/>
// 숫자/금액용 Geist Mono는 이미 globals.css에서 Google Fonts로 로드
```

### 타입 스케일
```
display:    text-2xl font-bold tracking-tight leading-tight   (24px, -0.025em)
h1:         text-xl  font-bold tracking-tight                 (20px)
h2:         text-lg  font-semibold                            (18px)
h3:         text-base font-semibold                           (16px)
body:       text-sm                                           (14px, 기본 15px body)
caption:    text-xs  text-[#A8A29E]                           (12px)
mono/숫자:  font-[family-name:var(--font-mono)] tabular-nums
```

### 숫자 금액 표시
```tsx
// 수익/손실 금액 — 무조건 mono + tabular
<span className="font-[family-name:var(--font-mono)] tabular-nums text-base font-semibold text-[#16A34A]">
  +₩{amount.toLocaleString()}
</span>
```

---

## 3. 카드 / 컨테이너

### 기본 카드 (CampaignCard, MerchantCard)
```tsx
<div className="bg-white border border-[#E7E5E4] rounded-2xl p-5
                shadow-[0_1px_3px_rgba(28,25,23,0.08),0_1px_2px_rgba(28,25,23,0.05)]
                hover:shadow-[0_4px_6px_rgba(28,25,23,0.07),0_2px_4px_rgba(28,25,23,0.05)]
                hover:-translate-y-px hover:border-[#D6D3D1]
                transition-all duration-200">
```

### 강조 카드 (당근 브랜드)
```tsx
<div className="bg-white border border-[#FFD5B8] rounded-2xl p-5
                shadow-[0_4px_14px_rgba(255,111,15,0.12)]
                hover:shadow-[0_4px_14px_rgba(255,111,15,0.22)]
                transition-all duration-200">
```

### 인라인 폼 카드 (머천트 추가 폼)
```tsx
<div className="border border-[#FFD5B8] rounded-2xl p-5 bg-[#FFF3EB]">
```

### 성과 요약 카드 (KPI 숫자)
```tsx
<div className="bg-white border border-[#E7E5E4] rounded-xl p-4
                shadow-[0_1px_3px_rgba(28,25,23,0.08)]">
  <p className="text-xs text-[#A8A29E] font-medium mb-1">오늘 수익</p>
  <p className="font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums text-[#16A34A]">
    +₩42,000
  </p>
  <p className="text-xs text-[#A8A29E] mt-1">전일 대비 ↑12%</p>
</div>
```

---

## 4. 프로그레스바

### 메인 체크리스트 프로그레스바
```tsx
// 단계별 컬러: 0~30% gray, 30~70% orange, 70~99% amber, 100% green
function getProgressColor(pct: number) {
  if (pct === 100) return "bg-[#16A34A]";      // 완료 — green
  if (pct >= 70)  return "bg-[#FF6F0F]";       // 거의 다 — karrot orange
  if (pct >= 30)  return "bg-[#FB923C]";       // 중반 — lighter orange
  return "bg-[#D6D3D1]";                        // 초반 — gray
}

<div>
  {/* 레이블 행 */}
  <div className="flex justify-between items-baseline mb-2">
    <span className="text-sm text-[#57534E]">
      <span className="font-semibold text-[#1C1917]">{checked}</span>/{total} 완료
    </span>
    <span className="text-sm font-bold text-[#1C1917]">{progress}%</span>
  </div>

  {/* 트랙 */}
  <div className="h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(progress)}`}
      style={{ width: `${progress}%` }}
    />
  </div>
</div>
```

### 5단계 세그먼트 프로그레스 (체크리스트 상단)
```tsx
// 5개 dot/segment로 단계를 시각화
<div className="flex gap-1.5">
  {phases.map((phase, i) => {
    const phasePct = getPhaseProgress(phase).checked / getPhaseProgress(phase).total;
    return (
      <div
        key={phase.id}
        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
          phasePct === 1   ? "bg-[#16A34A]" :
          phasePct > 0     ? "bg-[#FF6F0F]" :
                             "bg-[#E7E5E4]"
        }`}
      />
    );
  })}
</div>
```

### 완료 배너
```tsx
<div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 text-center">
  <div className="w-10 h-10 bg-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-2">
    {/* checkmark svg */}
  </div>
  <p className="font-bold text-[#15803D]">모든 준비 완료!</p>
  <p className="text-sm text-[#16A34A] mt-0.5">광고 집행 시작하세요</p>
</div>
```

---

## 5. 캘린더 셀

```tsx
// 날짜 셀 타입
type CellVariant = "profit" | "loss" | "breakeven" | "empty" | "today";

const cellStyles: Record<CellVariant, string> = {
  profit:    "bg-[#F0FDF4] border-[#BBF7D0] hover:bg-[#DCFCE7]",
  loss:      "bg-[#FEF2F2] border-[#FECACA] hover:bg-[#FEE2E2]",
  breakeven: "bg-[#F5F5F4] border-[#E7E5E4] hover:bg-[#EEEEEC]",
  empty:     "bg-white border-[#E7E5E4] hover:bg-[#FAFAF9]",
  today:     "bg-[#FFF3EB] border-[#FF6F0F] ring-1 ring-[#FF6F0F]",
};

// 셀 컴포넌트
function CalendarCell({ date, amount, variant }: CellProps) {
  return (
    <button
      className={`
        relative w-full aspect-square min-h-[56px]
        border rounded-xl p-1.5
        flex flex-col items-center justify-between
        cursor-pointer transition-all duration-150
        ${cellStyles[variant]}
      `}
    >
      {/* 날짜 */}
      <span className={`text-xs font-medium ${
        variant === "today" ? "text-[#FF6F0F] font-bold" : "text-[#A8A29E]"
      }`}>
        {date}
      </span>

      {/* 금액 */}
      {amount !== undefined && (
        <span className={`
          text-[11px] font-[family-name:var(--font-mono)] font-semibold tabular-nums
          leading-none text-center
          ${variant === "profit" ? "text-[#16A34A]" : ""}
          ${variant === "loss"   ? "text-[#DC2626]" : ""}
          ${variant === "breakeven" ? "text-[#78716C]" : ""}
        `}>
          {amount > 0 ? "+" : ""}{(amount / 1000).toFixed(0)}K
        </span>
      )}

      {/* 오늘 dot */}
      {variant === "today" && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2
                         w-1 h-1 rounded-full bg-[#FF6F0F]" />
      )}
    </button>
  );
}
```

### 캘린더 컨테이너
```tsx
<div className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden
                shadow-[0_1px_3px_rgba(28,25,23,0.08)]">
  {/* 헤더 */}
  <div className="px-4 py-3 border-b border-[#E7E5E4] flex items-center justify-between">
    <span className="font-semibold text-[#1C1917]">2025년 4월</span>
    <div className="flex gap-1">
      {/* 월 이동 버튼 */}
    </div>
  </div>

  {/* 요일 행 */}
  <div className="grid grid-cols-7 px-3 pt-3 pb-1">
    {["일","월","화","수","목","금","토"].map((d, i) => (
      <span key={d} className={`text-center text-[11px] font-medium pb-2 ${
        i === 0 ? "text-[#DC2626]" : i === 6 ? "text-[#2563EB]" : "text-[#A8A29E]"
      }`}>{d}</span>
    ))}
  </div>

  {/* 날짜 그리드 */}
  <div className="grid grid-cols-7 gap-1 px-3 pb-3">
    {/* CalendarCell 반복 */}
  </div>
</div>
```

---

## 6. 차트 영역 (recharts)

### 차트 컨테이너
```tsx
<div className="bg-white border border-[#E7E5E4] rounded-2xl p-5
                shadow-[0_1px_3px_rgba(28,25,23,0.08)]">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="font-semibold text-[#1C1917] text-sm">일별 수익</h3>
      <p className="text-xs text-[#A8A29E] mt-0.5">최근 30일</p>
    </div>
    {/* 필터 칩 */}
  </div>
  <ResponsiveContainer width="100%" height={200}>
    {/* recharts */}
  </ResponsiveContainer>
</div>
```

### recharts 컬러 팔레트
```tsx
const CHART_COLORS = {
  primary:    "#FF6F0F",   // 당근 — 메인 바/라인
  profit:     "#16A34A",   // 수익 양수
  loss:       "#DC2626",   // 손실 음수
  secondary:  "#FB923C",   // 보조 지표
  grid:       "#F5F5F4",   // 그리드 라인
  axis:       "#A8A29E",   // 축 레이블
  tooltip_bg: "#1C1917",   // 툴팁 배경
};

// AreaChart 예시
<Area
  type="monotone"
  dataKey="revenue"
  stroke={CHART_COLORS.primary}
  strokeWidth={2}
  fill={CHART_COLORS.primary}
  fillOpacity={0.08}
  dot={false}
  activeDot={{ r: 4, fill: CHART_COLORS.primary, strokeWidth: 2, stroke: "#fff" }}
/>

// recharts 공통 props
<CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="0" vertical={false} />
<XAxis
  tick={{ fontSize: 11, fill: CHART_COLORS.axis, fontFamily: "var(--font-sans)" }}
  axisLine={false}
  tickLine={false}
/>
<YAxis
  tick={{ fontSize: 11, fill: CHART_COLORS.axis, fontFamily: "var(--font-mono)" }}
  axisLine={false}
  tickLine={false}
  tickFormatter={(v) => `${(v/1000).toFixed(0)}K`}
/>
<Tooltip
  contentStyle={{
    background: CHART_COLORS.tooltip_bg,
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    padding: "8px 12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
  }}
  cursor={{ fill: "rgba(255,111,15,0.06)" }}
/>
```

---

## 7. 모달 디자인

```tsx
// 오버레이 + 모달 쉘
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    // 오버레이
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
                 bg-black/45 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      {/* 모달 패널 */}
      <div
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl
                   shadow-[0_25px_50px_rgba(28,25,23,0.22),0_12px_24px_rgba(28,25,23,0.12)]
                   max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모바일 drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-[#D6D3D1]" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4]">
          <h2 className="text-lg font-bold text-[#1C1917]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F5F4] hover:bg-[#E7E5E4]
                       flex items-center justify-center transition-colors"
          >
            {/* X icon */}
          </button>
        </div>

        {/* 바디 */}
        <div className="px-6 py-5">{children}</div>

        {/* 푸터 — sticky */}
        <div className="sticky bottom-0 bg-white border-t border-[#E7E5E4] px-6 py-4 flex gap-3">
          <button className="flex-1 py-3 rounded-xl border border-[#E7E5E4]
                             text-[#57534E] text-sm font-medium
                             hover:bg-[#FAFAF9] active:scale-[0.98] transition-all">
            취소
          </button>
          <button className="flex-1 py-3 rounded-xl bg-[#FF6F0F] text-white text-sm font-semibold
                             hover:bg-[#E05A00] active:scale-[0.98]
                             shadow-[0_4px_14px_rgba(255,111,15,0.35)] transition-all
                             disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
            만들기
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 인풋 / 셀렉트 스타일 (모달 내부)
```tsx
// Label
<label className="block text-xs font-semibold text-[#57534E] uppercase tracking-wide mb-1.5">
  캠페인 이름
</label>

// Input
<input
  className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-3.5 py-2.5
             text-sm text-[#1C1917] placeholder:text-[#D6D3D1]
             focus:outline-none focus:border-[#FF6F0F] focus:ring-2 focus:ring-[#FF6F0F]/20
             transition-all duration-150"
/>

// Select
<select
  className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-3.5 py-2.5
             text-sm text-[#1C1917]
             focus:outline-none focus:border-[#FF6F0F] focus:ring-2 focus:ring-[#FF6F0F]/20
             transition-all duration-150 appearance-none cursor-pointer"
/>
```

---

## 8. 탭 네비게이션

### 언더라인 탭 (현재 구조에 맞춤)
```tsx
<div className="flex border-b border-[#E7E5E4] mb-5 -mx-4 px-4 overflow-x-auto
                scrollbar-none snap-x">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => onTabChange(tab.id)}
      className={`
        relative px-1 py-3 mr-6 text-sm font-medium whitespace-nowrap
        transition-colors duration-150 shrink-0
        ${activeTab === tab.id
          ? "text-[#FF6F0F]"
          : "text-[#A8A29E] hover:text-[#57534E]"
        }
      `}
    >
      {tab.label}
      {/* active indicator */}
      {activeTab === tab.id && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5
                         bg-[#FF6F0F] rounded-full" />
      )}
    </button>
  ))}
</div>
```

### 당근 앱 스타일 2탭 (체크리스트 + 캠페인 관리)
```tsx
<div className="flex bg-[#F5F5F4] rounded-xl p-1 mb-5">
  {["checklist", "campaigns"].map((tab) => (
    <button
      key={tab}
      onClick={() => onTabChange(tab)}
      className={`
        flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
        ${activeTab === tab
          ? "bg-white text-[#1C1917] shadow-[0_1px_3px_rgba(28,25,23,0.12)]"
          : "text-[#A8A29E] hover:text-[#57534E]"
        }
      `}
    >
      {tab === "checklist" ? "체크리스트" : "캠페인 관리"}
    </button>
  ))}
</div>
```

---

## 9. 빈 상태 (Empty State)

```tsx
// 캠페인 없을 때
function EmptyCampaigns({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {/* SVG 일러스트 — 당근 테마 */}
      <div className="w-20 h-20 rounded-2xl bg-[#FFF3EB] flex items-center justify-center mb-5
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="12" width="24" height="18" rx="3" stroke="#FF6F0F" strokeWidth="1.5" fill="none"/>
          <path d="M14 12V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="#FF6F0F" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M14 20h12M14 25h8" stroke="#FFB27A" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      <h3 className="font-bold text-[#1C1917] text-base mb-1.5">
        아직 캠페인이 없어요
      </h3>
      <p className="text-sm text-[#A8A29E] leading-relaxed mb-6 max-w-[220px]">
        새 캠페인을 만들고 광고 준비 상태를 체크해보세요
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5
                   bg-[#FF6F0F] text-white text-sm font-semibold rounded-xl
                   hover:bg-[#E05A00] active:scale-[0.97]
                   shadow-[0_4px_14px_rgba(255,111,15,0.30)] transition-all"
      >
        + 첫 캠페인 만들기
      </button>
    </div>
  );
}

// 머천트 없을 때
function EmptyMerchants() {
  return (
    <div className="border-2 border-dashed border-[#E7E5E4] rounded-2xl
                    flex flex-col items-center py-12 px-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A8A29E" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72"/>
        </svg>
      </div>
      <p className="text-sm font-semibold text-[#57534E] mb-1">등록된 머천트가 없어요</p>
      <p className="text-xs text-[#A8A29E]">위 버튼으로 첫 머천트를 추가해보세요</p>
    </div>
  );
}
```

---

## 10. 마이크로 인터랙션

### 체크박스 체크 애니메이션 (ChecklistItem)
```tsx
// 체크박스 버튼 교체
<button
  onClick={() => onToggle(item.id)}
  className={`
    mt-0.5 w-5 h-5 rounded-[5px] flex-shrink-0 border-2 flex items-center justify-center
    transition-all duration-150
    active:scale-90
    ${checked
      ? "bg-[#FF6F0F] border-[#FF6F0F] shadow-[0_2px_8px_rgba(255,111,15,0.35)]"
      : "border-[#D6D3D1] hover:border-[#FF6F0F] hover:bg-[#FFF3EB]"
    }
  `}
  style={{
    // 완료 시 scale up → normal 효과를 keyframe 없이 처리
    transform: checked ? "scale(1)" : undefined,
  }}
>
  {checked && (
    <svg
      className="w-3 h-3 text-white"
      style={{ animation: "check-pop 150ms cubic-bezier(0.34,1.56,0.64,1)" }}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )}
</button>

// globals.css에 추가할 keyframe
// @keyframes check-pop {
//   0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
//   60%  { transform: scale(1.2) rotate(3deg); }
//   100% { transform: scale(1) rotate(0deg); opacity: 1; }
// }
```

### 체크된 항목 행 스타일
```tsx
<div className={`
  border rounded-xl p-3.5 transition-all duration-200
  ${checked
    ? "bg-[#F5F5F4] border-[#E7E5E4]"   // 완료 — neutral fade (초록 X, 너무 강함)
    : "bg-white border-[#E7E5E4] hover:border-[#D6D3D1] hover:shadow-[0_1px_3px_rgba(28,25,23,0.06)]"
  }
`}>
```

### Phase 헤더 (ChecklistPhase)
```tsx
<button
  onClick={() => setExpanded(!expanded)}
  className={`
    w-full flex items-center justify-between p-4 text-left
    transition-colors duration-150 rounded-t-xl
    ${isComplete ? "bg-[#F0FDF4]" : "bg-[#FAFAF9] hover:bg-[#F5F5F4]"}
  `}
>
  {/* 단계 번호 bubble */}
  <div className={`
    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
    transition-all duration-300
    ${isComplete
      ? "bg-[#16A34A] text-white shadow-[0_2px_8px_rgba(22,163,74,0.35)]"
      : "bg-[#FF6F0F] text-white"  // 진행중은 orange
    }
  `}>
    {isComplete ? <CheckIcon /> : phaseProgress.checked || phase.order}
  </div>
```

### CTA 버튼 (Primary)
```tsx
<button className="
  w-full py-3 px-4 rounded-xl
  bg-[#FF6F0F] text-white text-sm font-semibold
  hover:bg-[#E05A00]
  active:scale-[0.97] active:shadow-none
  shadow-[0_4px_14px_rgba(255,111,15,0.30)]
  hover:shadow-[0_4px_14px_rgba(255,111,15,0.45)]
  transition-all duration-150
  disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
">
  이어서 체크하기
</button>
```

### 새 캠페인 버튼 (Dashed)
```tsx
<button className="
  w-full py-3.5 px-4
  border-2 border-dashed border-[#FFD5B8] rounded-xl
  text-[#FF6F0F] text-sm font-semibold
  hover:border-[#FF6F0F] hover:bg-[#FFF3EB]
  active:scale-[0.98]
  transition-all duration-150
">
  + 새 캠페인 만들기
</button>
```

### 상태 배지
```tsx
const statusConfig = {
  active:  { label: "운영중",    cls: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]" },
  paused:  { label: "일시정지",  cls: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]" },
  ended:   { label: "종료",      cls: "bg-[#F5F5F4] text-[#78716C] border-[#E7E5E4]" },
};

<span className={`
  text-[11px] font-semibold px-2 py-0.5
  rounded-full border
  ${statusConfig[status].cls}
`}>
  {statusConfig[status].label}
</span>
```

---

## 11. 홈 헤더 + 레이아웃

```tsx
// layout.tsx body 수정
<body className="min-h-dvh flex flex-col bg-[#FAFAF9]">
  {children}
</body>

// page.tsx main
<main className="max-w-xl mx-auto w-full px-4 pt-6 pb-24">
  <header className="mb-7">
    {/* 로고/브랜드 */}
    <div className="flex items-center gap-2 mb-1">
      <div className="w-7 h-7 rounded-lg bg-[#FF6F0F] flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
          {/* 당근 or 체크마크 아이콘 */}
        </svg>
      </div>
      <span className="text-xs font-semibold text-[#A8A29E] uppercase tracking-widest">
        CPA 관리
      </span>
    </div>
    <h1 className="text-2xl font-bold text-[#1C1917] tracking-tight">
      내 캠페인
    </h1>
    <p className="text-sm text-[#A8A29E] mt-0.5">
      오늘도 수익 잘 챙기세요
    </p>
  </header>
```

---

## 12. globals.css에 추가할 keyframe

```css
/* ChecklistItem 체크 팝 애니메이션 */
@keyframes check-pop {
  0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
  60%  { transform: scale(1.25) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* 완료 배너 입장 */
@keyframes slide-down {
  from { transform: translateY(-8px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* 스켈레톤 shimmer — globals.css에 이미 있음 */
```

---

## 빠른 적용 우선순위

1. **globals.css** — 이미 교체 완료. `font-family` Pretendard CDN 추가 필요 (layout.tsx)
2. **CampaignCard** — 카드 그림자 + CTA 버튼 orange로 교체 (10분)
3. **ProgressBar** — 단계별 컬러 + 세그먼트 방식 (15분)
4. **NewCampaignModal** — 모달 쉘 + 인풋 스타일 (20분)
5. **ChecklistItem** — 체크박스 orange + 체크 팝 애니메이션 (15분)
6. **ChecklistPhase** — Phase bubble orange + 완료 green (10분)
7. **KarrotTabs** — pill 탭 스타일 교체 (5분)
