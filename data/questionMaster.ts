import type { Question } from "@/types";

export const questionMaster: Question[] = [
  // business_q1 - business_q10
  {
    questionId: "business_q1",
    questType: "business",
    chapter: 1,
    questionText:
      "商人が「売上が落ちている。何が原因かわからない」と訴えた。まず何をする？",
    options: [
      {
        key: "A",
        text: "AIに「売上低下の一般的な原因」を調べさせる",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "商人にいつ頃から・どのくらい落ちているか聞く",
        scores: { purpose: 3, design: 0, decision: 0 },
      },
      {
        key: "C",
        text: "競合店の状況をAIで調べる",
        scores: { purpose: 1, design: 1, decision: 0 },
      },
      {
        key: "D",
        text: "自分の経験から原因を推測して伝える",
        scores: { purpose: 1, design: 0, decision: 2 },
      },
    ],
  },
  {
    questionId: "business_q2",
    questType: "business",
    chapter: 1,
    questionText:
      "「3ヶ月前から・特に週末の客足が減っている」と聞いた。次にどうする？",
    options: [
      {
        key: "A",
        text: "「週末の集客改善策」をAIに依頼する",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "なぜ週末だけか商人に深掘りする",
        scores: { purpose: 3, design: 0, decision: 0 },
      },
      {
        key: "C",
        text: "AIに週末と平日の売上差を分析させる",
        scores: { purpose: 1, design: 2, decision: 0 },
      },
      {
        key: "D",
        text: "3ヶ月前に何があったか商人に確認する",
        scores: { purpose: 3, design: 0, decision: 1 },
      },
    ],
  },
  {
    questionId: "business_q3",
    questType: "business",
    chapter: 2,
    questionText:
      "「3ヶ月前に近くに大型施設がオープンした」とわかった。次に何をする？",
    options: [
      {
        key: "A",
        text: "AIに「大型施設への対抗策」を調べさせる",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "AIで「売上を回復した店舗事例」を調べる",
        scores: { purpose: 1, design: 2, decision: 0 },
      },
      {
        key: "C",
        text: "まだAIは使わず商人にさらに聞く",
        scores: { purpose: 2, design: 0, decision: 1 },
      },
      {
        key: "D",
        text: "AIに「この店の強みを活かした差別化戦略」を考えさせる",
        scores: { purpose: 1, design: 2, decision: 1 },
      },
    ],
  },
  {
    questionId: "business_q4",
    questType: "business",
    chapter: 2,
    questionText:
      "AIが「価格・品揃え・立地・サービス」の4軸を提示した。どうする？",
    options: [
      {
        key: "A",
        text: "4つ全部そのまま商人に提案する",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
      {
        key: "B",
        text: "自分で1〜2つに絞って提案する",
        scores: { purpose: 0, design: 2, decision: 3 },
      },
      {
        key: "C",
        text: "AIにどれが最優先か聞く",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "D",
        text: "商人と一緒に4つを見て考える",
        scores: { purpose: 0, design: 1, decision: 2 },
      },
    ],
  },
  {
    questionId: "business_q5",
    questType: "business",
    chapter: 3,
    questionText: "商人の強みは「地元常連客との関係性」とわかった。どう使う？",
    options: [
      {
        key: "A",
        text: "AIに「常連客向け施策」を提案させる",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "常連客についてさらに商人に深掘りする",
        scores: { purpose: 2, design: 0, decision: 0 },
      },
      {
        key: "C",
        text: "この強みを軸に自分で差別化の方向を決める",
        scores: { purpose: 1, design: 1, decision: 3 },
      },
      {
        key: "D",
        text: "強みと課題を整理した上でAIに戦略を考えさせる",
        scores: { purpose: 0, design: 3, decision: 1 },
      },
    ],
  },
  {
    questionId: "business_q6",
    questType: "business",
    chapter: 3,
    questionText: "AIと商人から情報が揃ってきた。次に何をする？",
    options: [
      {
        key: "A",
        text: "AIに「最終的な改善提案書」を作らせる",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
      {
        key: "B",
        text: "集めた情報を自分で整理して仮説を立てる",
        scores: { purpose: 1, design: 3, decision: 2 },
      },
      {
        key: "C",
        text: "商人に「何が一番困っているか」を改めて確認する",
        scores: { purpose: 2, design: 0, decision: 0 },
      },
      {
        key: "D",
        text: "AIに情報を全部渡して「何が問題か」を判断させる",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
    ],
  },
  {
    questionId: "business_q7",
    questType: "business",
    chapter: 4,
    questionText:
      "「常連客の維持＋週末の新規集客」が課題と見えてきた。AIに何を依頼する？",
    options: [
      {
        key: "A",
        text: "「週末の新規集客施策」だけを依頼する",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "「両立する施策」をまとめて依頼する",
        scores: { purpose: 0, design: 2, decision: 1 },
      },
      {
        key: "C",
        text: "2つの課題を分けて別々に依頼する",
        scores: { purpose: 0, design: 3, decision: 1 },
      },
      {
        key: "D",
        text: "予算・制約を確認してから依頼する",
        scores: { purpose: 1, design: 3, decision: 2 },
      },
    ],
  },
  {
    questionId: "business_q8",
    questType: "business",
    chapter: 4,
    questionText: "AIが5つの施策を提案した。商人に何を伝える？",
    options: [
      {
        key: "A",
        text: "AIが挙げた5案を比較表にして、そのまま商人に見せる",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
      {
        key: "B",
        text: "自分で2〜3案に絞り、優先順位をつけて伝える",
        scores: { purpose: 0, design: 2, decision: 3 },
      },
      {
        key: "C",
        text: "AIに「この店に最適な1案」を再判定させる",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "D",
        text: "商人の状況に合わせて施策内容を調整し、実行しやすい形で伝える",
        scores: { purpose: 0, design: 3, decision: 3 },
      },
    ],
  },
  {
    questionId: "business_q9",
    questType: "business",
    chapter: 5,
    questionText: "商人が「1つだけ試したい」と言った。どうする？",
    options: [
      {
        key: "A",
        text: "AIに効果予測を出させ、その結果をもとに決める",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
      {
        key: "B",
        text: "商人の状況を踏まえて、自分として最も現実的な1案を推薦する",
        scores: { purpose: 0, design: 1, decision: 3 },
      },
      {
        key: "C",
        text: "候補だけ示し、最終判断は商人に委ねる",
        scores: { purpose: 0, design: 0, decision: 1 },
      },
      {
        key: "D",
        text: "メリット・デメリットと実行負荷を整理し、商人と一緒に決める",
        scores: { purpose: 0, design: 1, decision: 2 },
      },
    ],
  },
  {
    questionId: "business_q10",
    questType: "business",
    chapter: 5,
    questionText: "商人から「本当にこれで大丈夫か？」と聞かれた。どう答える？",
    options: [
      {
        key: "A",
        text: "「AIの分析では有力ですが、実行して確かめる必要があります」",
        scores: { purpose: 0, design: 0, decision: 1 },
      },
      {
        key: "B",
        text: "「必ず上手くいくとは言えませんが、今ある情報ではこれが最善の判断です」",
        scores: { purpose: 0, design: 0, decision: 3 },
      },
      {
        key: "C",
        text: "「不確実さはありますが、まず小さく試して見極めるのが良いです」",
        scores: { purpose: 0, design: 0, decision: 2 },
      },
      {
        key: "D",
        text: "「念のためAIにも追加確認し、そのうえで最終判断します」",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
    ],
  },

  // daily_q1 - daily_q10
  {
    questionId: "daily_q1",
    questType: "daily",
    chapter: 1,
    questionText:
      "旅人が「来月、仲間5人で初めての旅に出たい。何から始めればいい？」と言った。まず何をする？",
    options: [
      {
        key: "A",
        text: "AIに「旅行の準備リスト」を作ってもらう",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "旅人にどんな旅にしたいか詳しく聞く",
        scores: { purpose: 3, design: 0, decision: 0 },
      },
      {
        key: "C",
        text: "人気の旅行先をAIで調べる",
        scores: { purpose: 1, design: 1, decision: 0 },
      },
      {
        key: "D",
        text: "自分の旅行経験をもとにアドバイスする",
        scores: { purpose: 1, design: 0, decision: 2 },
      },
    ],
  },
  {
    questionId: "daily_q2",
    questType: "daily",
    chapter: 1,
    questionText:
      "「みんなで楽しみたい・予算は少ない・移動は楽にしたい」と教えてくれた。次にどうする？",
    options: [
      {
        key: "A",
        text: "「予算が少ない旅行プラン」をAIに考えてもらう",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "5人全員の希望をもっと詳しく聞く",
        scores: { purpose: 3, design: 0, decision: 0 },
      },
      {
        key: "C",
        text: "予算内で行ける場所をAIで調べる",
        scores: { purpose: 1, design: 2, decision: 0 },
      },
      {
        key: "D",
        text: "移動が楽な旅行先を自分で考えて提案する",
        scores: { purpose: 1, design: 0, decision: 2 },
      },
    ],
  },
  {
    questionId: "daily_q3",
    questType: "daily",
    chapter: 2,
    questionText: "5人の希望がバラバラなことがわかった。次に何をする？",
    options: [
      {
        key: "A",
        text: "AIに「みんなが楽しめる旅行先」を提案してもらう",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "まだAIは使わず、全員の共通点を整理する",
        scores: { purpose: 2, design: 1, decision: 1 },
      },
      {
        key: "C",
        text: "AIに「予算・移動・楽しさを両立できる旅行先」を探してもらう",
        scores: { purpose: 1, design: 2, decision: 0 },
      },
      {
        key: "D",
        text: "AIに「バラバラな希望をまとめる方法」を聞く",
        scores: { purpose: 1, design: 1, decision: 1 },
      },
    ],
  },
  {
    questionId: "daily_q4",
    questType: "daily",
    chapter: 2,
    questionText:
      "AIが「テーマパーク・温泉・自然スポット」の3つを提案した。どうする？",
    options: [
      {
        key: "A",
        text: "3つ全部旅人に見せる",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
      {
        key: "B",
        text: "旅人の状況に合わせて自分で1つに絞る",
        scores: { purpose: 0, design: 2, decision: 3 },
      },
      {
        key: "C",
        text: "AIにどれが一番おすすめか聞く",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "D",
        text: "旅人と一緒に3つを見て話し合う",
        scores: { purpose: 0, design: 1, decision: 2 },
      },
    ],
  },
  {
    questionId: "daily_q5",
    questType: "daily",
    chapter: 3,
    questionText: "「予算が1人5000円しかない」とわかった。どう使う？",
    options: [
      {
        key: "A",
        text: "AIに「5000円でできる旅行」を調べてもらう",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "予算内でできることを自分でリストアップする",
        scores: { purpose: 1, design: 2, decision: 2 },
      },
      {
        key: "C",
        text: "予算と希望を整理してからAIに相談する",
        scores: { purpose: 1, design: 2, decision: 1 },
      },
      {
        key: "D",
        text: "旅人に予算を増やせないか確認する",
        scores: { purpose: 2, design: 0, decision: 1 },
      },
    ],
  },
  {
    questionId: "daily_q6",
    questType: "daily",
    chapter: 3,
    questionText:
      "交通費だけで予算オーバーになりそうとわかった。次にどうする？",
    options: [
      {
        key: "A",
        text: "AIに「交通費を安くする方法」を調べてもらう",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "近場で楽しめる場所に変更することを提案する",
        scores: { purpose: 0, design: 1, decision: 2 },
      },
      {
        key: "C",
        text: "問題点を整理してから旅人に報告する",
        scores: { purpose: 1, design: 1, decision: 1 },
      },
      {
        key: "D",
        text: "AIに「予算内で交通費も含めたプラン」を作ってもらう",
        scores: { purpose: 0, design: 3, decision: 0 },
      },
    ],
  },
  {
    questionId: "daily_q7",
    questType: "daily",
    chapter: 4,
    questionText:
      "「近場・低予算・全員楽しめる」という条件が固まった。AIに何を頼む？",
    options: [
      {
        key: "A",
        text: "「近場のおすすめスポット」を調べてもらう",
        scores: { purpose: 0, design: 1, decision: 0 },
      },
      {
        key: "B",
        text: "条件を全部伝えて「最適なプラン」を作ってもらう",
        scores: { purpose: 0, design: 1, decision: 1 },
      },
      {
        key: "C",
        text: "条件ごとに分けて別々に調べてもらう",
        scores: { purpose: 0, design: 2, decision: 1 },
      },
      {
        key: "D",
        text: "予算の内訳（交通・食事・入場料）も含めて計画してもらう",
        scores: { purpose: 0, design: 3, decision: 2 },
      },
    ],
  },
  {
    questionId: "daily_q8",
    questType: "daily",
    chapter: 4,
    questionText: "AIが3つのプランを提案した。旅人に何を伝える？",
    options: [
      {
        key: "A",
        text: "AIが出した3案を比較しやすい形で、そのまま旅人に見せる",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
      {
        key: "B",
        text: "自分で1案に絞り、理由を添えて提案する",
        scores: { purpose: 0, design: 1, decision: 3 },
      },
      {
        key: "C",
        text: "AIに「最も満足度が高い案」を再判定してもらう",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
      {
        key: "D",
        text: "旅人たちの希望に合わせて内容を調整し、提案する",
        scores: { purpose: 0, design: 2, decision: 3 },
      },
    ],
  },
  {
    questionId: "daily_q9",
    questType: "daily",
    chapter: 5,
    questionText:
      "旅人が「どのプランが一番楽しそう？」と聞いてきた。どう答える？",
    options: [
      {
        key: "A",
        text: "AIに「一番満足度が高い案」を選んでもらう",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
      {
        key: "B",
        text: "自分として一番良いと思う案をはっきり伝える",
        scores: { purpose: 0, design: 0, decision: 3 },
      },
      {
        key: "C",
        text: "候補だけ伝えて、あとは旅人たちに決めてもらう",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
      {
        key: "D",
        text: "それぞれのメリット・デメリットを説明して一緒に決める",
        scores: { purpose: 0, design: 1, decision: 2 },
      },
    ],
  },
  {
    questionId: "daily_q10",
    questType: "daily",
    chapter: 5,
    questionText: "旅人から「本当にこれで大丈夫？」と聞かれた。どう答える？",
    options: [
      {
        key: "A",
        text: "「AIの提案なので、かなり良いプランだと思います」",
        scores: { purpose: 0, design: 0, decision: 1 },
      },
      {
        key: "B",
        text: "「完璧ではないけど、みんなの希望を踏まえた最善のプランです」",
        scores: { purpose: 0, design: 0, decision: 3 },
      },
      {
        key: "C",
        text: "「まずはこの案で進めて、必要なら調整すれば大丈夫です」",
        scores: { purpose: 0, design: 0, decision: 2 },
      },
      {
        key: "D",
        text: "「念のため、もう一度AIにも確認してから伝えます」",
        scores: { purpose: 0, design: 0, decision: 0 },
      },
    ],
  },
];
