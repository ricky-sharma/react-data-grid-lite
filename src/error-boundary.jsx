import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, info) {
		console.error('react-data-grid-lite error:', error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div role="alert" style={{ padding: 10, color: 'red', fontWeight: 900 }}>
					<strong>Something went wrong while rendering the data grid</strong>
					<pre>{this.state.error?.toString()}</pre>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
