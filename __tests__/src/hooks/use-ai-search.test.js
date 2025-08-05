/* eslint-disable no-undef */
import { cleanup, renderHook } from '@testing-library/react';
import { useAISearch } from '../../../src/hooks/use-ai-search';

global.fetch = jest.fn();
jest.mock('../../../src/utils/loading-utils', () => jest.fn());
import trackPromise from '../../../src/utils/loading-utils';

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    cleanup();
});


describe('useAISearch', () => {
    it('calls custom backend when endpoint is provided and no apiKey', async () => {
        const mockResponse = [{ id: 1, name: 'Row 1' }];
        fetch.mockResolvedValueOnce({
            json: async () => mockResponse
        });

        const { result } = renderHook(() =>
            useAISearch({ endpoint: '/api/ai-search', customHeaders: { 'X-Test': 'yes' } })
        );

        const output = await result.current.runAISearch({
            query: 'find something',
            data: [{ id: 1 }]
        });

        expect(fetch).toHaveBeenCalledWith('/api/ai-search', expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
                'X-Test': 'yes'
            }),
            body: JSON.stringify({ query: 'find something', data: [{ id: 1 }] })
        }));
        expect(trackPromise).toHaveBeenCalled();
        expect(output).toEqual(mockResponse);
    });

    it('throws error if no API key or endpoint is provided', async () => {
        const { result } = renderHook(() => useAISearch({}));

        await expect(result.current.runAISearch({
            query: 'test',
            data: []
        })).rejects.toThrow('No API key provided for direct OpenAI call.');
    });

    it('calls custom runAISearch if provided', async () => {
        const customFn = jest.fn().mockResolvedValue([{ custom: true }]);
        const { result } = renderHook(() =>
            useAISearch({ customRunAISearch: customFn })
        );

        const output = await result.current.runAISearch({ query: 'x', data: [] });
        expect(customFn).toHaveBeenCalledWith({ query: 'x', data: [] });
        expect(output).toEqual([{ custom: true }]);
    });

    it('calls OpenAI backend when API key is provided', async () => {
        const aiResponse = {
            choices: [
                {
                    message: {
                        content: JSON.stringify([{ id: 1, name: 'Test' }])
                    }
                }
            ]
        };
        fetch.mockResolvedValueOnce({
            json: async () => aiResponse
        });

        const { result } = renderHook(() =>
            useAISearch({ apiKey: 'test-key' })
        );

        const output = await result.current.runAISearch({ query: 'Q', data: [{ id: 1 }] });

        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: 'Bearer test-key'
            })
        }));
        expect(trackPromise).toHaveBeenCalled();
        expect(output).toEqual([{ id: 1, name: 'Test' }]);
    });

    it('throws if AI response content is not an array', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => { });

        const aiResponse = {
            choices: [
                { message: { content: JSON.stringify({ invalid: true }) } }
            ]
        };
        fetch.mockResolvedValueOnce({
            json: async () => aiResponse
        });

        const { result } = renderHook(() => useAISearch({ apiKey: 'test' }));

        await expect(result.current.runAISearch({ query: 'x', data: [] }))
            .rejects.toThrow('AI response is not an array');

        console.error.mockRestore();
    });


    it('throws if AI response has no content', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                choices: [{ message: {} }]
            })
        });

        const { result } = renderHook(() => useAISearch({ apiKey: 'test' }));

        await expect(result.current.runAISearch({ query: 'x', data: [] }))
            .rejects.toThrow('No response content from AI');
    });
});