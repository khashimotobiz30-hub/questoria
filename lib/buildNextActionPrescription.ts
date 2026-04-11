/**
 * `nextActionLead` / `nextActions` / `riskPoint` / `growth` から
 * 「今後意識して取り組むこと」の処方箋本文 + 強調枠用の具体1アクションを組み立てる。
 * 既存マスタの文言を材料に再編集する（データ構造は変えない）。
 */

export type NextActionPrescription = {
  /** 傾向 → 意識するとよいこと → どう変わるか（段落は \n\n 区切り） */
  body: string;
  /** 強調枠内：具体アクション1文のみ（句点まで整える） */
  immediateAction: string;
};

function pick(...candidates: (string | undefined)[]): string {
  for (const c of candidates) {
    const v = c?.trim();
    if (v) return v;
  }
  return "";
}

function soften(s: string): string {
  return s.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
}

function firstBlock(s: string): string {
  const t = s.trim();
  if (!t) return "";
  const parts = t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return soften(parts[0] ?? t);
}

function trimTrailingPeriod(s: string): string {
  return s.trim().replace(/[。．…]+$/u, "");
}

function ensurePeriod(s: string): string {
  const t = s.trim();
  if (!t) return "";
  return /[。！？…]$/.test(t) ? t : `${t}。`;
}

export function buildNextActionPrescription(input: {
  riskPoint?: string;
  growth?: string;
  nextActionLead?: string;
  nextActions?: readonly string[];
}): NextActionPrescription | null {
  const actions = (input.nextActions ?? []).map((x) => x.trim()).filter(Boolean);
  const [a0, a1, a2] = [actions[0], actions[1], actions[2]];

  const riskRaw = pick(input.riskPoint);
  const growthRaw = pick(input.growth);
  const lead = pick(input.nextActionLead);

  if (!riskRaw && !growthRaw && !lead && actions.length === 0) {
    return null;
  }

  // 第1段落：傾向
  let para1 = firstBlock(riskRaw);
  if (!para1) {
    para1 =
      "強みを活かしつつ、小さなクセを一つ意識して整えると伸びやすいタイプです。";
  }

  // 第2段落：だから何を意識するとよいか（lead + 第1アクションを「意識」の軸に）
  let para2 = "";
  if (lead) {
    para2 = lead.trim();
  }
  if (a0) {
    const core = trimTrailingPeriod(a0);
    const bridge = `伸ばすなら、${core}を意識の出発点にすると、軸が定まりやすくなります。`;
    para2 = para2 ? `${para2}\n\n${bridge}` : bridge;
  }
  if (!para2) {
    para2 = "負担の小さい一点からで構いません。まずは一つだけ決めてみてください。";
  }

  // 第3段落：それによってどう変わるか
  let para3 = firstBlock(growthRaw);
  if (a1) {
    const mid = soften(a1);
    const sentence = ensurePeriod(mid);
    if (para3) {
      para3 = `${para3}\n\n${sentence}`;
    } else {
      para3 = sentence;
    }
  }
  if (!para3) {
    para3 = "意識がそろうほど、迷いが減り、同じ動き方を再現しやすくなります。";
  }

  const body = [para1, para2, para3].join("\n\n");

  /** 本文の主軸（第1アクション）と強調枠を一致させる */
  const rawNow = pick(a0);
  const immediateAction = ensurePeriod(
    trimTrailingPeriod(soften(rawNow || "メモに、今日始める一歩を1行だけ書いてみる")),
  );

  return { body, immediateAction };
}
