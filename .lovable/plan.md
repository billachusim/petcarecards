# Voice Fill — talk instead of typing

Add a "Talk about your pet" option so a caregiver can describe their pet out loud and the app fills the Care Card form automatically. Same two-minute promise, no typing.

## What the user experiences

1. On the Add Pet screen (and each Care Card step), a "Speak instead" button appears.
2. Tapping it opens a simple recording sheet: a mic button, a live transcript, and a prompt with examples — "Tell me about your pet: name, breed, age, what and when they eat, medications, vet and emergency contacts, and their routine."
3. The user talks. Words appear as they speak.
4. Tapping Done sends the transcript for parsing. A short "Reading your notes…" state follows.
5. The app shows a review screen: every field it extracted, editable, with anything it could not find left blank and clearly marked. Nothing is saved until the user confirms.
6. Confirming fills the pet + care card forms; the user can still edit any step as usual.

Safety: nothing is auto-committed without the review screen, and medication details are always flagged with "Please double-check dosages" since misheard numbers matter.

## Free vs premium

- Every user gets **2 free voice fills**. A counter shows "1 free voice fill left".
- After that, the recording sheet shows the existing upgrade card with the exact current copy: "Unlock Lifetime — $4.99" / "One payment. Lifetime access. No subscription."
- Premium (verified entitlement) = unlimited voice fills. The gate reads the same verified entitlement used by other premium features; the free-use counter is stored locally like the rest of the app data.

## How the speech is captured

- **First choice: the device's own dictation** (built into Chrome, Edge, and Safari). Free, instant, live transcript, no audio ever leaves the device.
- **Fallback: audio transcription in our backend** for browsers without it (e.g. Firefox). The recording is sent once, transcribed, and not stored.
- English only for now. The mic button is hidden with an explanation if the browser blocks microphone access.

## Language, first release

English only. The parser is told to expect English; other languages can be added later without changing the flow.

## Technical notes

- New feature folder `src/features/voice/`:
  - `use-speech-recognition.ts` — wraps the browser Web Speech API, exposes `supported`, `listening`, interim + final transcript, and errors.
  - `wav-recorder.ts` — Web Audio PCM capture encoded to a complete 16 kHz mono WAV for the fallback path (avoids the fragmented-MediaRecorder 400s).
  - `voice-fill-sheet.tsx` — the recording/review UI, built on existing shadcn dialog/sheet + warm design tokens.
  - `voice-review.tsx` — editable field-by-field confirmation.
  - `voice.functions.ts` — two `createServerFn` endpoints.
- `transcribeAudio` server fn: forwards the uploaded WAV to `https://ai.gateway.lovable.dev/v1/audio/transcriptions` with `openai/gpt-4o-transcribe`, size/type validated, `LOVABLE_API_KEY` read inside the handler. Errors surfaced verbatim to the UI.
- `parseCareTranscript` server fn: sends the transcript to the Lovable AI Gateway Responses API with `openai/gpt-5.6-sol`, streaming, consumed server-side, using a strict JSON schema mapped to the existing models in `src/features/pets/models.ts` (Pet, FeedingSchedule, CareRoutine, Medication, EmergencyContact, Veterinarian). Every property required and nullable so unheard fields come back null rather than invented. Prompt forbids inventing dosages, diagnoses, or vet advice — unheard values stay null.
- Client never sees `LOVABLE_API_KEY`; both endpoints are server-side only.
- Gateway errors handled per status: 429/5xx get one bounded retry with a "Try again in a moment" message; 402/403 show a plain-language "Voice fill is temporarily unavailable — you can still type the details" and never loop.
- Free-use counter lives in the existing local repository alongside other local data; premium check reuses the verified entitlement service.
- Accessibility: the mic button has a clear label and state announcement, the transcript area is a live region, and the whole flow is keyboard-operable with typing always available as the primary path.

## Out of scope

No always-on listening, no voice commands elsewhere in the app, no stored audio, no multi-language UI.
