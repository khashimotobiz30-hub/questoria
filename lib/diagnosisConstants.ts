/**
 * 診断の正規化スコア（0–100）に対する軸レベル閾値。
 * `getLevel` / `getResultType` で同一値を参照し、変更時の不整合を防ぐ。
 */
export const AXIS_HIGH_THRESHOLD = 67;

/** HIGH 未満かつこの値以上なら MID、未満なら LOW */
export const AXIS_MID_THRESHOLD = 34;
