import type { DiagnosisMode, LightDiagnosisResult } from "@/types";

import { lightQuestionMaster } from "@/data/lightQuestionMaster";
import { supabase } from "@/lib/supabaseClient";
import {
  buildAnswersJson,
  buildAnswersLabeledJson,
  generateLightResponseId,
  getOrCreateLightSessionId,
  getUtmParams,
  setLastLightResponseId,
} from "@/lib/lightResponseLog";

function nowIso(): string {
  return new Date().toISOString();
}

export async function createLightResponseLogSupabase(input: {
  result: Pick<LightDiagnosisResult, "resultType" | "answers" | "questionSetId" | "version">;
  light_response_id?: string;
}): Promise<{ light_response_id: string } | null> {
  if (!supabase || typeof window === "undefined") return null;
  try {
    const session_id = getOrCreateLightSessionId();
    if (!session_id) return null;

    const created_at = nowIso();
    const light_response_id = input.light_response_id ?? generateLightResponseId();
    const selected = input.result.answers.map((a) => ({ questionId: a.questionId, optionId: a.optionId }));
    const utm = getUtmParams();

    const payload = {
      created_at,
      updated_at: created_at,
      light_response_id,
      session_id,
      question_set_id: input.result.questionSetId,
      version: input.result.version,
      source: "light",
      result_type: input.result.resultType,
      answers_json: buildAnswersJson(selected),
      answers_labeled_json: buildAnswersLabeledJson(lightQuestionMaster, selected),
      went_to_deep: false,
      deep_mode: null,
      deep_started_at: null,
      clicked_line: false,
      line_clicked_at: null,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    };

    const { error } = await supabase.from("light_response_logs").insert(payload);
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[Questoria] supabase insert light_response_logs failed", error);
      return null;
    }

    // Keep pointer for later updates.
    setLastLightResponseId(light_response_id);
    return { light_response_id };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[Questoria] createLightResponseLogSupabase failed", e);
    return null;
  }
}

export async function markLightResponseWentToDeepSupabase(
  lightResponseId: string,
  deepMode: DiagnosisMode,
): Promise<void> {
  if (!supabase) return;
  try {
    const t = nowIso();
    const { data, error } = await supabase
      .from("light_response_logs")
      .update({
        updated_at: t,
        went_to_deep: true,
        deep_mode: deepMode,
        deep_started_at: t,
      })
      .eq("light_response_id", lightResponseId)
      .select("light_response_id");
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[Questoria] supabase update went_to_deep failed", error);
    } else if (!data || data.length === 0) {
      // eslint-disable-next-line no-console
      console.warn("[Questoria] supabase update went_to_deep affected 0 rows", { lightResponseId });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[Questoria] markLightResponseWentToDeepSupabase failed", e);
  }
}

export async function markLightResponseClickedLineSupabase(lightResponseId: string): Promise<void> {
  if (!supabase) return;
  try {
    const t = nowIso();
    const { data, error } = await supabase
      .from("light_response_logs")
      .update({
        updated_at: t,
        clicked_line: true,
        line_clicked_at: t,
      })
      .eq("light_response_id", lightResponseId)
      .select("light_response_id");
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[Questoria] supabase update clicked_line failed", error);
    } else if (!data || data.length === 0) {
      // eslint-disable-next-line no-console
      console.warn("[Questoria] supabase update clicked_line affected 0 rows", { lightResponseId });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[Questoria] markLightResponseClickedLineSupabase failed", e);
  }
}

