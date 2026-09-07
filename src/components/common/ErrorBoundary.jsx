import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('StateLens error boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h2 className="font-serif text-2xl mb-3">Something broke.</h2>
            <p className="text-ink-soft mb-4">
              This part of the page hit an unexpected error. Reloading the
              page usually fixes it. Your account and saved experiments are
              unaffected.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-ink text-paper rounded-sm text-sm"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
