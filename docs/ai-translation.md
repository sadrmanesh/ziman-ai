# AI translation

The offline phrasebook comes first. AIML is used only when a phrase is not in the book, you have saved a key, and you ask for a translation.

## Get and save a key

1. Create a key at [aimlapi.com](https://aimlapi.com/).
2. Open Ziman **Settings**.
3. Paste the key and choose **Save key**.
4. Optionally choose **Check key**. That sends one short request to AIML to see whether the key is accepted.

The key is stored with `chrome.storage.local` on this browser. It is not written to `chrome.storage.sync`, is not included in the extension package, and is not sent to the developer. See [Privacy](privacy.md).

Ziman talks only to `https://api.aimlapi.com`. A raw OpenAI, Anthropic, or Google key works only if AIML accepts that key on your account.

## What is sent

When AI translation runs, the extension sends:

- the text you asked to translate,
- the source and target language names,
- the selected tone (neutral, formal, or informal),
- the selected model name,
- your key in the `Authorization` header.

The request goes to `https://api.aimlapi.com/v1/chat/completions`. AIML’s terms and privacy policy cover what they do with that request. This extension does not operate its own translation backend.

A key check is a short request of the same kind, used only to test the key.

## Models, costs, and billing

The default model is `gpt-4o-mini`. You can pick another model listed in Settings. Availability depends on your AIML account, not on Ziman.

Ziman does not sell credits and does not charge you. Usage is billed by AIML according to your plan and the model you choose. If the account balance is empty, translation cannot run until you add funds at [AIML billing](https://aimlapi.com/app/billing/).

Keep requests reasonably short. The extension rejects text longer than 4,000 characters.

## Error messages

| Situation | What you should see |
| --- | --- |
| The key is rejected | The API key was rejected. |
| The key is valid but the AIML balance is empty | The key is valid but the AIML balance is empty, with a link to add funds. |
| Too many requests | Rate limit exceeded. Wait and try again. |
| The request takes too long | The translation request timed out. |
| AIML cannot be reached | The translation service could not be reached. |
| The selected model is not allowed on the account | A message that the model is not available, without echoing the key. |

If a request fails but the phrasebook can still answer word by word, Ziman may show that glossary fallback and label it clearly.

## When the key is missing

If the text is not in the phrasebook and no key is saved, the extension asks you to add a key in Settings. It does not invent a translation and it does not send the text anywhere.
