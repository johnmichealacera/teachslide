import { Presentation } from '@/types/presentation';

function stripMarkdownFence(text: string): string {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

function extractJsonObject(text: string): string | null {
  const content = stripMarkdownFence(text);
  const start = content.indexOf('{');

  if (start === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < content.length; index += 1) {
    const character = content[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }

      continue;
    }

    if (character === '"') {
      inString = true;
    } else if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      depth -= 1;

      if (depth === 0) {
        return content.slice(start, index + 1);
      }
    }
  }

  return null;
}

function repairJson(json: string): string {
  return json
    .replace(/\r\n/g, '\n')
    .replace(/,\s*([\]}])/g, '$1')
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");
}

function isPresentation(value: unknown): value is Presentation {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const presentation = value as Presentation;

  return (
    typeof presentation.title === 'string' &&
    Array.isArray(presentation.slides) &&
    presentation.slides.length > 0 &&
    Array.isArray(presentation.quiz) &&
    presentation.slides.every(
      (slide) =>
        typeof slide.title === 'string' &&
        Array.isArray(slide.content) &&
        Array.isArray(slide.talkingPoints)
    ) &&
    presentation.quiz.every(
      (question) =>
        typeof question.question === 'string' &&
        Array.isArray(question.options) &&
        typeof question.correctAnswer === 'string' &&
        typeof question.explanation === 'string'
    )
  );
}

export function parsePresentationResponse(response: string): Presentation {
  const candidates = [response.trim()];

  const extracted = extractJsonObject(response);
  if (extracted) {
    candidates.push(extracted);
    candidates.push(repairJson(extracted));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;

      if (isPresentation(parsed)) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  throw new Error('Model returned invalid presentation JSON');
}
