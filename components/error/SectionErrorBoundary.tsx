"use client";

import React from "react";

interface SectionErrorBoundaryProps {
  /** Editorial label shown if this section fails, e.g. "PROJECTS" */
  label: string;
  children: React.ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

/**
 * Isolates runtime failures to a single homepage section so one component
 * exception can never blank the entire page or the sections below it.
 * Renders a minimal, accessible fallback with a retry action.
 */
export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    // Surface for remote debugging (chrome://inspect) without breaking UX
    console.error(`[SectionErrorBoundary:${this.props.label}]`, error);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <section aria-label={`${this.props.label} unavailable`} className="section">
          <div className="container-narrow">
            <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground mb-3">
              {this.props.label}
            </p>
            <p className="body text-muted-foreground mb-4">
              This section failed to load on this device.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center text-sm font-mono text-primary hover:underline underline-offset-4 min-h-[44px]"
            >
              RETRY SECTION
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
