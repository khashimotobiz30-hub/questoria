import type { ResultType } from "@/types";

type TypeData = {
  resultType: ResultType;
  nameJa: string;
  nameEn: string;
  tagline: string;
  description: { essence: string; strength: string; growth: string };
  colors: { primary: string; secondary: string };
  imagePath: string; // 例: "/types/hero.png"（STEP0時点では画像未配置でよい）
};

export const typeMaster: Record<ResultType, TypeData> = {
  hero: {
    resultType: "hero",
    nameJa: "勇者",
    nameEn: "HERO",
    tagline:
      "課題を見抜き、道を描き、最後は自分で決断できる。AI時代の真のプレイヤー。",
    description: {
      essence:
        "あなたは、AIを使って状況を整理し、課題の本質を自分で定義し、最後は自分の意志で決断できるタイプです。",
      strength:
        "曖昧な状況でも前進できるため、企画・改善・意思決定の場面で圧倒的な強さを発揮します。AIを道具として使いこなしている数少ない存在です。",
      growth:
        "次のステージは、自分一人で解くことではなく、AIと他者を巻き込みながら再現性ある成果を作ることです。",
    },
    colors: { primary: "#00E5FF", secondary: "#FFD700" },
    imagePath: "/types/hero.png",
  },
  sage: {
    resultType: "sage",
    nameJa: "賢者",
    nameEn: "SAGE",
    tagline: "課題を見抜き、完璧な道筋を描く。チームの知恵袋。",
    description: {
      essence:
        "あなたは、問題の本質を鋭く見抜き、緻密な戦略を設計できるタイプです。AIを使った情報整理・構造化が得意で、チームの羅針盤になれます。",
      strength:
        "企画立案・戦略設計・資料作成など、「考える」フェーズで圧倒的な力を発揮します。チームに一人いると頼もしい存在です。",
      growth:
        "完璧な設計を求めるあまり、最後の一手を躊躇することがあります。「8割の精度で動く」判断力を磨くと、さらに強くなります。",
    },
    colors: { primary: "#9C27B0", secondary: "#C0C0C0" },
    imagePath: "/types/sage.png",
  },
  berserker: {
    resultType: "berserker",
    nameJa: "狂戦士",
    nameEn: "BERSERKER",
    tagline: "目指すべき場所が見えている。あとは突き進むだけ。",
    description: {
      essence:
        "あなたは、課題の本質を直感的に掴み、自分の意志で迷わず動けるタイプです。AIを力技で使いこなす、圧倒的な突破力の持ち主です。",
      strength:
        "スピードと決断力が武器です。答えが見えたら即行動できるため、変化が速い環境や締め切りがある局面で強さを発揮します。",
      growth:
        "突破力はある。次に必要なのは、AIを「設計の道具」として使う技術です。道筋を整えることで、突進の精度が格段に上がります。",
    },
    colors: { primary: "#F44336", secondary: "#212121" },
    imagePath: "/types/berserker.png",
  },
  oracle: {
    resultType: "oracle",
    nameJa: "占い師",
    nameEn: "ORACLE",
    tagline: "誰も気づかない課題の本質を、いち早く見抜く。",
    description: {
      essence:
        "あなたは、他の人が見落とす問題の本質を鋭く察知できるタイプです。「何が問題か」を定義する力は、チームの中で群を抜いています。",
      strength:
        "課題発見・リサーチ・ユーザー理解など、「問いを立てる」フェーズで力を発揮します。その洞察力はプロジェクトの方向性を左右するほどです。",
      growth:
        "見えている課題を、具体的な行動に落とし込む設計力と、自分で決断する習慣を身につけることで、洞察がはじめて成果に変わります。",
    },
    colors: { primary: "#2196F3", secondary: "#FFD700" },
    imagePath: "/types/oracle.png",
  },
  artisan: {
    resultType: "artisan",
    nameJa: "鍛冶師",
    nameEn: "ARTISAN",
    tagline: "道を描き、自分で決める。アウトプットはいつも一級品。",
    description: {
      essence:
        "あなたは、与えられた課題に対して緻密な設計を立て、自分の判断で仕上げる実行力のあるタイプです。AIを使ったアウトプットの質が高い。",
      strength:
        "実装・制作・改善など、「作る」フェーズで圧倒的な力を発揮します。設計から判断まで自分でできるため、一人でプロジェクトを動かせます。",
      growth:
        "課題の定義を自分で行う力を磨くと、さらに上のステージへ進めます。「何を作るか」を自分で決められた時、真の実力者になります。",
    },
    colors: { primary: "#FF6D00", secondary: "#8D6E63" },
    imagePath: "/types/artisan.png",
  },
  wizard: {
    resultType: "wizard",
    nameJa: "魔法使い",
    nameEn: "WIZARD",
    tagline: "AIを華麗に操り、複雑な道筋を鮮やかに描く。",
    description: {
      essence:
        "あなたは、AIを使った情報整理・戦略設計・実行計画が得意なタイプです。複雑な課題でも、鮮やかにプロセスを組み立てられます。",
      strength:
        "プロジェクト設計・プロセス改善・複雑なタスク整理など、「仕組みを作る」場面で力を発揮します。チームに魔法をかけるような存在です。",
      growth:
        "設計力はすでにある。次に必要なのは「自分で課題を定義する力」と「最後に自分で決める覚悟」です。その二つが揃った時、最強の魔法使いが誕生します。",
    },
    colors: { primary: "#00E5FF", secondary: "#9C27B0" },
    imagePath: "/types/wizard.png",
  },
  pioneer: {
    resultType: "pioneer",
    nameJa: "冒険者",
    nameEn: "PIONEER",
    tagline: "地図がなくても、答えがなくても、踏み出せる。",
    description: {
      essence:
        "あなたは、誰よりも早く行動に移せる覚悟と決断力を持つタイプです。正解がない状況でも、自分の意志で一歩を踏み出せます。",
      strength:
        "新しいことへの挑戦・未開拓の領域・スピードが求められる局面で力を発揮します。その行動力は、チームに勢いをもたらします。",
      growth:
        "踏み出す力はある。次に必要なのは、AIを使って「課題を整理する力」と「道筋を設計する力」です。この二つが加わった時、開拓者は本物のリーダーになります。",
    },
    colors: { primary: "#4CAF50", secondary: "#FFFFFF" },
    imagePath: "/types/pioneer.png",
  },
  origin: {
    resultType: "origin",
    nameJa: "はじまりの者",
    nameEn: "ORIGIN",
    tagline: "すべての冒険は、ここから始まる。",
    description: {
      essence:
        "あなたは今、AI活用の入口に立っています。まだ力は眠っている状態ですが、ここから始まる伸びしろは誰よりも大きい。",
      strength:
        "先入観がないことは、実は強みです。正しい使い方を一度身につければ、変なクセがない分だけ、真っ直ぐ成長できます。",
      growth:
        "まず「課題を自分で定義する」ことから始めましょう。AIに頼る前に、「何を解決したいのか」を言葉にする習慣が、すべての出発点です。",
    },
    colors: { primary: "#006064", secondary: "#9E9E9E" },
    imagePath: "/types/origin.png",
  },
};
