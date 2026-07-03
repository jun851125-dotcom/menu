import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Catch and display global errors on screen for easy user/developer debugging
window.onerror = function (message, source, lineno, colno, error) {
  const errorDiv = document.getElementById('runtime-error-screen') || document.createElement('div');
  errorDiv.id = 'runtime-error-screen';
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100vw';
  errorDiv.style.height = '100vh';
  errorDiv.style.backgroundColor = '#fff0f0';
  errorDiv.style.color = '#c00000';
  errorDiv.style.padding = '30px';
  errorDiv.style.zIndex = '999999';
  errorDiv.style.fontFamily = 'Consolas, monospace';
  errorDiv.style.overflow = 'auto';
  errorDiv.style.boxSizing = 'border-box';
  errorDiv.innerHTML = `
    <h1 style="margin-bottom: 15px; font-size: 24px; border-bottom: 2px solid #ffcccc; padding-bottom: 10px;">
      ⚠️ 網頁運行時錯誤 (Runtime Error)
    </h1>
    <p style="font-size: 15px; margin-bottom: 10px;">
      <strong>錯誤訊息:</strong> ${message}
    </p>
    <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
      <strong>檔案來源:</strong> ${source} (${lineno}:${colno})
    </p>
    <h3 style="margin-top: 20px; font-size: 16px;">錯誤呼叫棧 (Stack Trace):</h3>
    <pre style="background-color: #ffe6e6; padding: 15px; border-radius: 6px; border: 1px solid #ffcccc; overflow-x: auto; margin-top: 8px; font-size: 13px; line-height: 1.5;">${error?.stack || '無 Stack Trace 可用'}</pre>
    <p style="margin-top: 20px; color: #666; font-size: 12px;">請複製或截圖此錯誤訊息以協助我們進行修復，謝謝！</p>
  `;
  document.body.appendChild(errorDiv);
  return false;
};

window.onunhandledrejection = function (event) {
  const reason = event.reason;
  if (window.onerror) {
    window.onerror(
      `未處理的 Promise 拒絕 (Unhandled Promise Rejection): ${reason?.message || reason}`,
      'promise-rejection',
      0,
      0,
      reason instanceof Error ? reason : new Error(reason)
    );
  }
};

// React Error Boundary Component for safety
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', backgroundColor: '#fff0f0', color: '#c00000', fontFamily: 'monospace' }}>
          <h2>⚠️ React 元件渲染崩潰 (Component Crash)</h2>
          <p><strong>錯誤訊息:</strong> {this.state.error?.message}</p>
          <pre style={{ backgroundColor: '#ffe6e6', padding: '15px', borderRadius: '6px', marginTop: '10px' }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

