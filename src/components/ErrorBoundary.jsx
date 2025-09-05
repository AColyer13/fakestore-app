import React from 'react';
import { Alert } from 'react-bootstrap';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Optionally log error
  }
  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="m-5 text-center" role="alert">
          <h4>Something went wrong.</h4>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</pre>
        </Alert>
      );
    }
    return this.props.children;
  }
}
