/**
 * AIML API Integration for Ziman AI Extension
 * Provides advanced AI-powered translation using multiple models
 * API Documentation: https://aimlapi.com/
 */

const AIML_BILLING_URL = 'https://aimlapi.com/app/billing/';

const AIML_COPY = {
    en: {
        noCredits: 'Key is valid but the AIML balance is empty',
        invalidKey: 'The API key was rejected.',
        rateLimit: 'Rate limit exceeded. Wait and try again.',
        timeout: 'The translation request timed out.',
        network: 'The translation service could not be reached.',
        modelFallback: 'This model is not available on the account.'
    },
    fa: {
        noCredits: 'کلید معتبر است، اما موجودی AIML خالی است',
        invalidKey: 'کلید پذیرفته نشد.',
        rateLimit: 'محدودیت تعداد درخواست. کمی بعد دوباره تلاش کنید.',
        timeout: 'زمان درخواست ترجمه تمام شد.',
        network: 'اتصال به سرویس ترجمه برقرار نشد.',
        modelFallback: 'این مدل برای این حساب در دسترس نیست.'
    },
    ku: {
        noCredits: 'کلیل دروستە، بەڵام باڵانسی AIML بەتاڵە',
        invalidKey: 'کلیلەکە وەرنەگیرا.',
        rateLimit: 'سنووری داواکاری تێپەڕی. کەمێک چاوەڕێ بکە.',
        timeout: 'کاتی داواکاری وەرگێڕان تەواو بوو.',
        network: 'پەیوەندی بە خزمەتگوزاری وەرگێڕانەوە نەکرا.',
        modelFallback: 'ئەم مۆدێلە بۆ ئەم هەژمارە بەردەست نییە.'
    }
};

function classifyAimlResponse(status, body, errorName) {
    const data = body && typeof body === 'object' ? body : {};
    const err = data.error && typeof data.error === 'object' ? data.error : {};
    const kind = err.data && err.data.kind ? String(err.data.kind) : '';
    const message = String(err.message || data.message || '');
    if (errorName === 'AbortError') return { code: 'timeout' };
    if (status == null) return { code: 'network' };
    if (status === 401) return { code: 'invalid-key' };
    if (status === 429) return { code: 'rate-limit' };
    if (kind === 'err_insufficent_credits' || /run out of funds/i.test(message)) {
        return { code: 'no-credits', billingUrl: AIML_BILLING_URL };
    }
    if (status === 403) return { code: 'model-forbidden', serverMessage: message };
    return { code: 'http', serverMessage: message, status: status };
}

class AIMLAPI {
    constructor() {
        this.apiKey = '';
        this.baseUrl = 'https://api.aimlapi.com/v1';
        this.models = {
            // Free tier models (more likely to work)
            'gpt-4o-mini': 'openai/gpt-4o-mini',
            'gpt-3.5-turbo': 'openai/gpt-3.5-turbo',
            'claude-3-haiku': 'anthropic/claude-3-haiku-20240307',
            'llama-3': 'meta-llama/llama-3.3-8b-instruct',
            'gemini-2.0': 'google/gemini-2.0-flash-exp',
            
            // Premium models (may require higher tier)
            'deepseek-r1': 'deepseek/deepseek-r1',
            'claude-3.7': 'anthropic/claude-3-7-sonnet-20241022',
            'gpt-4o': 'openai/gpt-4o',
            'qwen-3': 'qwen/qwen-3-235b-instruct',
            'gemini-2.5': 'google/gemini-2.5-pro'
        };
        
        this.defaultModel = 'gpt-4o-mini';
        this.preferredModel = 'gpt-4o-mini';
        this.uiLang = 'en';
        this.requestTimeoutMs = 30000;
        this.errorHandler = null;
    }

    copy(code) {
        const pack = AIML_COPY[this.uiLang] || AIML_COPY.en;
        return pack[code] || AIML_COPY.en[code] || '';
    }

    failureText(classified) {
        if (classified.code === 'invalid-key') return this.copy('invalidKey');
        if (classified.code === 'no-credits') return this.copy('noCredits');
        if (classified.code === 'rate-limit') return this.copy('rateLimit');
        if (classified.code === 'timeout') return this.copy('timeout');
        if (classified.code === 'network') return this.copy('network');
        if (classified.code === 'model-forbidden') return this.hideSecret(classified.serverMessage || this.copy('modelFallback'));
        return this.hideSecret(classified.serverMessage || 'The translation request failed.');
    }

    hideSecret(message) {
        const text = String(message || '');
        if (this.apiKey && text.includes(this.apiKey)) {
            return text.split(this.apiKey).join('…');
        }
        return text;
    }

    /**
     * Translate text using AI models
     */
    async translateText(text, sourceLang, targetLang, tone = 'neutral') {
        if (!this.apiKey) {
            throw new Error('An AIML API key is required. Add your own key in Ziman AI settings.');
        }

        const systemPrompt = this.createTranslationPrompt(sourceLang, targetLang, tone);
        const model = this.selectBestModel();
        const response = await this.callChatCompletion(model, systemPrompt, text);
        const cleanedTranslation = this.cleanTranslation(response && response.content);
        if (!cleanedTranslation) {
            throw new Error('The model returned an empty translation.');
        }
        return cleanedTranslation;
    }

    /**
     * Create system prompt for translation
     */
    createTranslationPrompt(sourceLang, targetLang, tone) {
        const languageNames = this.getLanguageNames(sourceLang, targetLang);
        const toneInstructions = this.getToneInstructions(tone);
        
        return `You are "Ziman AI", a professional Kurdish language translator specialized in Kurdish (Sorani and Kurmanji dialects) and 10 major world languages.

TASK: Translate the following text from ${languageNames.source} to ${languageNames.target}.

TRANSLATION REQUIREMENTS:
1. Maintain exact meaning, nuance, tone, and cultural context
2. Output must be grammatically correct, fluent, and natural in ${languageNames.target}
3. ${toneInstructions}
4. Preserve proper nouns, names, place names, and brand names
5. Translate idioms and expressions to convey equivalent meaning
6. Maintain any special formatting (line breaks, punctuation)
7. Provide ONLY the translated text, no explanations

SOURCE LANGUAGE: ${languageNames.source}
TARGET LANGUAGE: ${languageNames.target}
TONE: ${tone.toUpperCase()}

Translate the following text:`;
    }

    /**
     * Get language names for prompts
     */
    getLanguageNames(sourceLang, targetLang) {
        const languageMap = {
            'ku-sorani': 'Kurdish (Sorani)',
            'ku-kurmanji': 'Kurdish (Kurmanji)',
            'en': 'English',
            'ar': 'Arabic',
            'fa': 'Persian',
            'tr': 'Turkish',
            'fr': 'French',
            'de': 'German',
            'es': 'Spanish',
            'ru': 'Russian',
            'zh': 'Chinese',
            'ja': 'Japanese'
        };
        
        return {
            source: languageMap[sourceLang] || sourceLang,
            target: languageMap[targetLang] || targetLang
        };
    }

    /**
     * Get tone instructions
     */
    getToneInstructions(tone) {
        const toneMap = {
            'formal': 'Use formal, respectful language appropriate for business, academic, or official contexts',
            'informal': 'Use casual, friendly language appropriate for conversations with friends or family',
            'neutral': 'Use balanced, professional language that is neither too formal nor too casual'
        };
        
        return toneMap[tone] || toneMap.neutral;
    }

    /**
     * Select the best AI model for the language combination
     */
    selectBestModel() {
        const key = this.preferredModel && this.models[this.preferredModel]
            ? this.preferredModel
            : this.defaultModel;
        return this.models[key];
    }

    /**
     * Call AI model for translation
     */
    async callChatCompletion(model, systemPrompt, userText) {
        const requestBody = {
            model: model,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userText
                }
            ],
            max_tokens: 2000,
            temperature: 0.3, // Lower temperature for more consistent translations
            top_p: 0.9
        };

        if (!this.apiKey) {
            throw new Error('An AIML API key is required. Add your own key in Ziman AI settings.');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);
        let response;
        try {
            response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
        } catch (error) {
            const classified = classifyAimlResponse(null, {}, error && error.name);
            const wrapped = new Error(this.failureText(classified));
            wrapped.code = classified.code;
            throw wrapped;
        } finally {
            clearTimeout(timeoutId);
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const classified = classifyAimlResponse(response.status, errorData);
            const error = new Error(this.failureText(classified));
            error.code = classified.code;
            error.billingUrl = classified.billingUrl || '';
            error.serverMessage = this.hideSecret(classified.serverMessage || '');
            throw error;
        }

        let data;
        try {
            data = await response.json();
        } catch (error) {
            throw new Error('The translation service returned an unreadable response.');
        }
        const message = data && data.choices && data.choices[0] && data.choices[0].message;
        if (!message) {
            throw new Error('The translation service returned an unexpected response.');
        }
        return message;
    }

    /**
     * Clean and format translation output
     */
    cleanTranslation(translation) {
        if (!translation) return '';
        let cleaned = String(translation).replace(/```[\s\S]*?```/g, '');
        cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
        
        // Remove any explanatory text
        cleaned = cleaned.replace(/Translation:|Translated text:|Here's the translation:/i, '');
        
        // Clean up extra whitespace
        cleaned = cleaned.trim();
        
        // Remove quotes if the entire text is wrapped in them
        if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
            (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            cleaned = cleaned.slice(1, -1);
        }
        
        return cleaned.trim();
    }

    /**
     * Get available models
     */
    async getAvailableModels() {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.status}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Failed to fetch available models:', error);
            return Object.values(this.models);
        }
    }

    /**
     * Test API key validity
     */
    async testAPIKey() {
        try {
            if (!this.apiKey) {
                return { valid: false, message: 'No API key saved' };
            }
            const model = this.models[this.preferredModel] || this.models[this.defaultModel];
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: 'hi' }],
                    max_tokens: 1
                })
            });
            
            const errorData = await response.json().catch(() => ({}));
            const classified = classifyAimlResponse(response.status, errorData);
            if (response.ok) {
                return { valid: true, balanceEmpty: false, code: 'ok', message: 'API key is valid' };
            }
            if (classified.code === 'no-credits') {
                return {
                    valid: true,
                    balanceEmpty: true,
                    code: 'no-credits',
                    billingUrl: AIML_BILLING_URL,
                    message: this.copy('noCredits')
                };
            }
            if (classified.code === 'invalid-key') {
                return { valid: false, balanceEmpty: false, code: 'invalid-key', message: this.copy('invalidKey') };
            }
            if (classified.code === 'rate-limit') {
                return { valid: false, balanceEmpty: false, code: 'rate-limit', message: this.copy('rateLimit') };
            }
            if (classified.code === 'model-forbidden') {
                return { valid: false, code: 'model-forbidden', serverMessage: this.hideSecret(classified.serverMessage || ''), message: this.hideSecret(classified.serverMessage || 'This model is not available on the account.') };
            }
            return { valid: false, code: classified.code, message: `API key test failed: ${response.status}` };
        } catch (error) {
            return { valid: false, message: `Network error: ${this.hideSecret(error.message)}` };
        }
    }

    /**
     * Test API connection
     */
    async testConnection() {
        const keyTest = await this.testAPIKey();
        if (!keyTest.valid) {
            return { success: false, message: keyTest.message };
        }
        return { success: true, message: keyTest.message };
    }

    /**
     * Get usage statistics
     */
    async getUsage() {
        try {
            const response = await fetch(`${this.baseUrl}/usage`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch usage: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch usage:', error);
            return null;
        }
    }

    /**
     * Batch translate multiple texts
     */
    async batchTranslate(texts, sourceLang, targetLang, tone = 'neutral') {
        const results = [];
        
        for (let i = 0; i < texts.length; i++) {
            try {
                const translation = await this.translateText(texts[i], sourceLang, targetLang, tone);
                results.push({
                    original: texts[i],
                    translated: translation,
                    success: true
                });
                
                // Add delay between requests to avoid rate limiting
                if (i < texts.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                results.push({
                    original: texts[i],
                    translated: null,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }

    /**
     * Get model information
     */
    getModelInfo(modelKey) {
        const modelInfo = {
            'deepseek-r1': {
                name: 'DeepSeek R1',
                description: 'Advanced reasoning model with excellent multilingual support',
                maxTokens: 128000,
                languages: ['English', 'Chinese', 'Arabic', 'Persian', 'Turkish', 'Kurdish']
            },
            'claude-3.7': {
                name: 'Claude 3.7 Sonnet',
                description: 'Balanced reasoning and speed with strong European language support',
                maxTokens: 200000,
                languages: ['English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese']
            },
            'gpt-4o': {
                name: 'GPT-4o',
                description: 'OpenAI\'s latest multimodal model with broad language support',
                maxTokens: 128000,
                languages: ['English', 'Multiple European and Asian languages']
            },
            'qwen-3': {
                name: 'Qwen 3 235B',
                description: 'Massive-scale model with strong Asian language capabilities',
                maxTokens: 32768,
                languages: ['Chinese', 'Japanese', 'Korean', 'English', 'Arabic']
            }
        };
        
        return modelInfo[modelKey] || {
            name: 'Unknown Model',
            description: 'Model information not available',
            maxTokens: 10000,
            languages: ['Unknown']
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIMLAPI;
}
const zimanRoot = typeof globalThis !== 'undefined' ? globalThis : this;
AIMLAPI.classify = classifyAimlResponse;
AIMLAPI.BILLING_URL = AIML_BILLING_URL;
zimanRoot.AIMLAPI = AIMLAPI;
