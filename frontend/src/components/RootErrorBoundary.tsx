import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { translations, type Language } from '../i18n/translations'

type Props = { children: ReactNode }

type State = { hasError: boolean }

function currentUiLanguage(): Language {
  const raw = typeof document !== 'undefined' ? document.documentElement.lang : ''
  if (raw === 'ar' || raw === 'fr' || raw === 'en') return raw
  return 'en'
}

/**
 * Catches render errors below `BrowserRouter` so we can still offer navigation home.
 * Copy uses `translations` directly (not `useI18n`) so this works even if context fails.
 */
export class RootErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[RootErrorBoundary]', error, info.componentStack)
    }
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    const lang = currentUiLanguage()
    const c = translations[lang].common
    const dir = lang === 'ar' ? 'rtl' : 'ltr'

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6 py-16"
        dir={dir}
        lang={lang}
      >
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-bold tracking-tight">{c.errorTitle}</h1>
          <p className="text-sm text-slate-300 leading-relaxed">{c.errorBody}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold transition-colors"
            >
              {c.reloadPage}
            </button>
            <Link
              to="/"
              className="rounded-lg border border-white/20 hover:bg-white/10 px-4 py-2 text-sm font-semibold transition-colors text-center"
            >
              {c.backToGateway}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
