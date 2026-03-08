"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            padding: "32px 24px",
            background: "var(--bg-elevated)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--error-subtle)",
              border: "1px solid rgba(239,68,68,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "var(--error)",
            }}
          >
            ✕
          </div>

          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              {this.props.label ?? "Something went wrong"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                maxWidth: 360,
                lineHeight: 1.6,
              }}
            >
              {this.state.error.message}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" size="sm" onClick={this.reset}>
              Try again
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
          </div>

          <details style={{ width: "100%", textAlign: "left" }}>
            <summary
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Stack trace
            </summary>
            <pre
              style={{
                marginTop: 8,
                padding: 12,
                background: "var(--bg-base)",
                borderRadius: "var(--radius-sm)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
                overflow: "auto",
                maxHeight: 200,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {this.state.error.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
