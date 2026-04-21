import type { LightAxisKey } from "@/types";

export type LightOption = {
  id: string; // "A" | "B" | "C" | "D" など
  label: string;
  /** コア設問用（Q9/Q10/Q11） */
  coreScore?: number;
  /** 補正（加点/減点）。複数軸への同時補正を許可する。 */
  adjustment?: Partial<Record<LightAxisKey, number>>;
};

export type LightQuestion = {
  id: string; // "Q1"〜"Q12"
  order: number; // 1〜12
  prompt: string;
  options: LightOption[];
  /** コア設問（Q9/Q10/Q11） */
  coreAxis?: LightAxisKey;
};

export const LIGHT_QUESTION_SET_ID = "light_v1";
export const LIGHT_QUESTION_SET_VERSION = 1 as const;

export const lightQuestionMaster: readonly LightQuestion[] = [
  {
    id: "q1_position",
    order: 1,
    prompt: "現在の立場",
    options: [
      { id: "employee", label: "会社員" },
      { id: "student", label: "学生" },
      { id: "solo_worker", label: "個人で仕事をしている" },
      { id: "business_owner", label: "事業を運営している" },
      { id: "other", label: "その他" },
    ],
  },
  {
    id: "q2_ai_frequency",
    order: 2,
    prompt: "AIの利用頻度",
    options: [
      {
        id: "rarely",
        label: "ほとんど使わない",
        adjustment: { purpose: -1, design: -1 },
      },
      { id: "few_times_week", label: "週に数回" },
      { id: "almost_daily", label: "ほぼ毎日使う" },
      { id: "heavy_daily", label: "毎日かなり使う" },
    ],
  },
  {
    id: "q3_main_purpose",
    order: 3,
    prompt: "AIを使う主な目的",
    options: [
      { id: "research", label: "情報収集" },
      { id: "work_efficiency", label: "仕事の効率化" },
      { id: "learning", label: "学習" },
      { id: "writing", label: "発信や文章作成" },
      { id: "monetize", label: "副業や収益化" },
      {
        id: "unclear",
        label: "まだはっきりしていない",
        adjustment: { purpose: -1 },
      },
    ],
  },
  {
    id: "q4_biggest_problem",
    order: 4,
    prompt: "AIで今いちばん困っていること",
    options: [
      {
        id: "dont_know_what_to_ask",
        label: "何を聞けばいいかわからない",
        adjustment: { purpose: -2 },
      },
      {
        id: "not_getting_expected_answer",
        label: "思った答えが返ってこない",
        adjustment: { design: -2 },
      },
      {
        id: "not_sure_if_correct",
        label: "答えが正しいか不安になる",
        adjustment: { judgment: -2 },
      },
      {
        id: "not_leading_to_action",
        label: "使っても行動につながらない",
        adjustment: { purpose: -1, design: -1 },
      },
      {
        id: "cannot_continue",
        label: "続かない",
        adjustment: { purpose: -1 },
      },
      { id: "no_problem", label: "特に困っていない" },
    ],
  },
  {
    id: "q5_anxiety",
    order: 5,
    prompt: "AIに対する不安・抵抗感",
    options: [
      {
        id: "might_believe_wrong_info",
        label: "間違った情報を信じてしまいそう",
        adjustment: { judgment: -1 },
      },
      {
        id: "cant_use_well",
        label: "うまく使いこなせる気がしない",
        adjustment: { design: -1 },
      },
      {
        id: "might_depend_too_much",
        label: "頼りすぎてしまいそう",
        adjustment: { judgment: -1 },
      },
      { id: "feels_difficult", label: "何となく難しそうに感じる" },
      { id: "no_anxiety", label: "特に不安はない" },
    ],
  },
  {
    id: "q6_future_goal",
    order: 6,
    prompt: "今後AIでできるようになりたいこと",
    options: [
      { id: "use_effectively", label: "調べるだけで終わらせず活かしたい" },
      { id: "use_for_work", label: "仕事で使えるようになりたい" },
      { id: "monetize", label: "収益化につなげたい" },
      { id: "use_for_output", label: "発信に活かしたい" },
      { id: "find_best_style", label: "自分に合った使い方を見つけたい" },
    ],
  },
  {
    id: "q7_stance",
    order: 7,
    prompt: "AIを使うときのスタンス",
    options: [
      {
        id: "want_answer_first",
        label: "まず答えをもらいたい",
        adjustment: { purpose: -1 },
      },
      {
        id: "thinking_partner",
        label: "一緒に考える相手として使いたい",
        adjustment: { design: +1 },
      },
      {
        id: "organize_my_thoughts",
        label: "自分の考えを整理するために使いたい",
        adjustment: { purpose: +1 },
      },
      {
        id: "cannot_express_yet",
        label: "まだうまく言えない",
        adjustment: { purpose: -1, design: -1 },
      },
    ],
  },
  {
    id: "q8_after_using_ai",
    order: 8,
    prompt: "AIを使ったあとに起こりやすいこと",
    options: [
      {
        id: "next_action_clear",
        label: "次にやることが見えてくる",
        adjustment: { purpose: +1, design: +1 },
      },
      {
        id: "useful_but_stop",
        label: "参考にはなるが止まりやすい",
        adjustment: { design: -1 },
      },
      {
        id: "answer_but_still_unsure",
        label: "答えは出るけど迷いも残る",
        adjustment: { judgment: -1 },
      },
      {
        id: "just_look_and_finish",
        label: "見て終わることが多い",
        adjustment: { purpose: -1, design: -1 },
      },
    ],
  },
  {
    id: "q9_how_to_start",
    order: 9,
    prompt: "AIを使うときの始め方",
    coreAxis: "purpose",
    options: [
      { id: "mostly_defined", label: "聞きたいことがある程度決まっている", coreScore: 4 },
      { id: "rough_then_refine", label: "ざっくり決めて、使いながら固める", coreScore: 3 },
      { id: "ask_first_then_find_direction", label: "まず聞いてから方向を探す", coreScore: 2 },
      { id: "often_unsure_what_to_ask", label: "何を聞くか迷うことが多い", coreScore: 1 },
    ],
  },
  {
    id: "q10_when_answer_is_off",
    order: 10,
    prompt: "思った答えが出ないとき",
    coreAxis: "design",
    options: [
      { id: "add_or_change_conditions", label: "条件を足したり変えたりする", coreScore: 4 },
      { id: "split_and_reask", label: "話を分けて聞き直す", coreScore: 3 },
      { id: "change_wording_a_bit", label: "少し言い方を変えてみる", coreScore: 2 },
      { id: "tend_to_stop", label: "うまく進まず止まりやすい", coreScore: 1 },
    ],
  },
  {
    id: "q11_when_ai_differs",
    order: 11,
    prompt: "AIの答えが自分の感覚と違ったとき",
    coreAxis: "judgment",
    options: [
      { id: "pause_and_rethink", label: "いったん止まって考え直す", coreScore: 4 },
      { id: "there_may_be_other_views", label: "別の見方もありそうだと思う", coreScore: 3 },
      { id: "use_ai_as_base_first", label: "まずはAIの答えをベースにする", coreScore: 2 },
      { id: "tend_to_accept_as_is", label: "そのまま採用しがち", coreScore: 1 },
    ],
  },
  {
    id: "q12_current_state",
    order: 12,
    prompt: "AIを使っていて、今の自分に一番近いのは？",
    options: [
      {
        id: "not_using_well_yet",
        label: "まだうまく使いこなせていない",
        adjustment: { purpose: -1, design: -1, judgment: -1 },
      },
      {
        id: "using_but_weak_feedback",
        label: "使っているけど、手応えは弱い",
        adjustment: { design: -1 },
      },
      { id: "somewhat_useful", label: "ある程度役立てられている" },
      {
        id: "have_own_style",
        label: "自分なりの使い方ができている",
        adjustment: { purpose: +1, design: +1, judgment: +1 },
      },
    ],
  },
] as const;

