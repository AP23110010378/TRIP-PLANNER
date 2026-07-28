/**
 * validateItinerary.js
 * Client-side validation of AI-returned itinerary JSON.
 * Used as a second layer of defense after server validation.
 */

const VALID_CATEGORIES = new Set(['sightseeing', 'food', 'transport', 'activity', 'rest', 'other']);

/**
 * Strip markdown code fences from a string.
 * Handles ```json ... ```, ``` ... ```, and similar variants.
 */
export function stripCodeFences(text) {
  if (typeof text !== 'string') return text;
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

/**
 * Tolerant JSON parse: strips code fences, then tries JSON.parse.
 * Returns { ok: true, data } or { ok: false, error: string }
 */
export function parseAIResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { ok: false, error: 'Empty or non-string response.' };
  }

  const cleaned = stripCodeFences(rawText);

  try {
    const data = JSON.parse(cleaned);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: `JSON parse error: ${err.message}` };
  }
}

/**
 * Validate and sanitize a stop object.
 * Returns the sanitized stop or null if it's unrecoverable.
 */
function validateStop(stop, dayIdx, stopIdx) {
  if (!stop || typeof stop !== 'object') return null;

  // name is required — can't recover without it
  if (!stop.name || typeof stop.name !== 'string' || !stop.name.trim()) return null;

  return {
    id: (stop.id && typeof stop.id === 'string') ? stop.id : `stop-${dayIdx + 1}-${stopIdx + 1}`,
    name: stop.name.trim(),
    time: (stop.time && typeof stop.time === 'string') ? stop.time.trim() : 'Flexible',
    category: VALID_CATEGORIES.has(stop.category) ? stop.category : 'other',
    description: (stop.description && typeof stop.description === 'string')
      ? stop.description.trim()
      : '',
  };
}

/**
 * Validate and sanitize a day object.
 * Returns the sanitized day or null if it's unrecoverable.
 */
function validateDay(day, dayIdx) {
  if (!day || typeof day !== 'object') return null;

  if (!Array.isArray(day.stops)) return null;

  const validStops = day.stops
    .map((stop, stopIdx) => validateStop(stop, dayIdx, stopIdx))
    .filter(Boolean);

  if (validStops.length === 0) return null;

  return {
    id: (day.id && typeof day.id === 'string') ? day.id : `day-${dayIdx + 1}`,
    dayNumber: (typeof day.dayNumber === 'number' && day.dayNumber > 0) ? day.dayNumber : dayIdx + 1,
    title: (day.title && typeof day.title === 'string') ? day.title.trim() : `Day ${dayIdx + 1}`,
    stops: validStops,
  };
}

/**
 * Full itinerary validation.
 * Returns { valid: boolean, itinerary: object | null, errors: string[] }
 *
 * - Filters invalid days (drops rather than rejecting the whole response)
 * - Filters invalid stops within each day
 * - Returns valid: false only if NOTHING is salvageable
 */
export function validateItinerary(obj) {
  const errors = [];

  if (!obj || typeof obj !== 'object') {
    return { valid: false, itinerary: null, errors: ['Response is not a JSON object.'] };
  }

  if (!Array.isArray(obj.days)) {
    return { valid: false, itinerary: null, errors: ['Response is missing the "days" array.'] };
  }

  if (obj.days.length === 0) {
    return { valid: false, itinerary: null, errors: ['The "days" array is empty.'] };
  }

  const validDays = obj.days
    .map((day, idx) => {
      const result = validateDay(day, idx);
      if (!result) {
        errors.push(`Day ${idx + 1} was invalid or had no valid stops — skipped.`);
      }
      return result;
    })
    .filter(Boolean);

  if (validDays.length === 0) {
    return {
      valid: false,
      itinerary: null,
      errors: [...errors, 'No valid days could be extracted from the response.'],
    };
  }

  const itinerary = {
    destination: (obj.destination && typeof obj.destination === 'string')
      ? obj.destination.trim()
      : 'Your Destination',
    durationDays: (typeof obj.durationDays === 'number' && obj.durationDays > 0)
      ? obj.durationDays
      : validDays.length,
    summary: (obj.summary && typeof obj.summary === 'string') ? obj.summary.trim() : '',
    days: validDays,
  };

  return { valid: true, itinerary, errors };
}
