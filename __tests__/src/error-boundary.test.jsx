import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../src/error-boundary';

describe('ErrorBoundary', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it('renders children when no error is thrown', () => {
        const TestComponent = () => <div>Normal content</div>;

        render(
            <ErrorBoundary>
                <TestComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Normal content')).toBeInTheDocument();
    });

    it('catches error and renders fallback UI when a child throws during render', () => {
        const ThrowingComponent = () => {
            throw new Error('Render failure');
        };

        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        );

        // Check fallback UI appears
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/Render failure/)).toBeInTheDocument();
    });
});
