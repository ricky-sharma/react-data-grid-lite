import { useCallback } from 'react';
import {
    OpenAI_API_EndPoint,
    OpenAI_API_Model,
    OpenAI_Default_System_Prompt
} from '../constants';
import trackPromise from '../utils/loading-utils';

export function useAISearch({
    apiKey,
    model = OpenAI_API_Model,
    endpoint,
    systemPrompt,
    customRunAISearch,
    customHeaders
}) {
    const defaultAISearch = useCallback(
        async ({ data, query }) => {
            const isCustomBackend = endpoint && !apiKey;

            if (isCustomBackend) {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...customHeaders
                    },
                    body: JSON.stringify({ query, data })
                });

                trackPromise(response);
                const json = await response.json();

                if (!Array.isArray(json)) {
                    throw new Error('Invalid AI search response format from backend.');
                }

                return json;
            }

            if (!apiKey) {
                throw new Error('No API key provided for direct OpenAI call.');
            }

            const finalEndpoint = endpoint || OpenAI_API_EndPoint;
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                ...customHeaders
            };

            const body = {
                model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt || OpenAI_Default_System_Prompt
                    },
                    {
                        role: 'user',
                        content: `Data:\n${JSON.stringify(data)}\n\nQuery:\n"${query}"\n\nReturn only matching rows as a pure JSON array.`
                    }
                ],
                temperature: 0
            };

            const response = await fetch(finalEndpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            trackPromise(response);

            const json = await response.json();
            const content = json?.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('No response content from AI');
            }

            let result;
            try {
                result = JSON.parse(content);
            } catch (err) {
                console.error('Failed to parse AI result as JSON:', content);
                throw err;
            }

            if (!Array.isArray(result)) {
                console.error('AI result is not an array:', result);
                throw new Error('AI response is not an array');
            }
            return result;
        },
        [apiKey, endpoint, model, systemPrompt]
    );

    const runAISearch = useCallback(
        async ({ query, data }) => {
            if (typeof customRunAISearch === 'function') {
                return await customRunAISearch({ query, data });
            }
            return await defaultAISearch({ query, data });
        },
        [customRunAISearch, defaultAISearch]
    );

    return {
        runAISearch
    };
}