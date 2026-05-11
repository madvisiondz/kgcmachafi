import { Code, computeDAGLayout, Divider, H1, H2, Stack, Text, useHostTheme } from 'cursor/canvas';

/**
 * High-level runtime + data flow for `frontend/` (Vite + React Router).
 * Open in Cursor Canvas preview beside the chat.
 */
export default function FrontendBlockDiagram() {
  const theme = useHostTheme();

  const layout = computeDAGLayout({
    nodes: [
      { id: 'Vite (dev/build)' },
      { id: 'main.tsx + index.html' },
      { id: 'BrowserRouter' },
      { id: 'I18nProvider (AR/FR/EN + dir)' },
      { id: 'translations.ts' },
      { id: 'App.tsx (shell)' },
      { id: 'DocumentTitle' },
      { id: 'Header + Footer' },
      { id: '<Routes />' },
      { id: 'Page components' },
      { id: 'src/data/*.ts (mocks)' },
      { id: 'public/ (icons, favicon, media)' },
    ],
    edges: [
      { from: 'Vite (dev/build)', to: 'main.tsx + index.html' },
      { from: 'main.tsx + index.html', to: 'BrowserRouter' },
      { from: 'BrowserRouter', to: 'I18nProvider (AR/FR/EN + dir)' },
      { from: 'translations.ts', to: 'I18nProvider (AR/FR/EN + dir)' },
      { from: 'I18nProvider (AR/FR/EN + dir)', to: 'App.tsx (shell)' },
      { from: 'App.tsx (shell)', to: 'DocumentTitle' },
      { from: 'App.tsx (shell)', to: 'Header + Footer' },
      { from: 'App.tsx (shell)', to: '<Routes />' },
      { from: '<Routes />', to: 'Page components' },
      { from: 'src/data/*.ts (mocks)', to: 'Page components' },
      { from: 'I18nProvider (AR/FR/EN + dir)', to: 'Header + Footer' },
      { from: 'I18nProvider (AR/FR/EN + dir)', to: 'Page components' },
      { from: 'public/ (icons, favicon, media)', to: 'Page components' },
    ],
    direction: 'vertical',
    nodeWidth: 268,
    nodeHeight: 42,
    rankGap: 48,
    nodeGap: 16,
    padding: 14,
  });

  return (
    <Stack gap={20}>
      <Stack gap={6}>
        <H1>MACHAFI frontend — block diagram</H1>
        <Text tone="secondary">
          Top-down data flow: static i18n bundle and mock modules feed the route tree; layout chrome wraps every page.
          Future API calls should sit behind a thin <Code>services/</Code> layer (not shown).
        </Text>
      </Stack>

      <Divider />

      <H2>Runtime graph (DAG)</H2>
      <div
        style={{
          border: `1px solid ${theme.stroke.secondary}`,
          background: theme.bg.elevated,
          borderRadius: 10,
          padding: 12,
          overflow: 'auto',
        }}
      >
        <svg width={layout.width} height={layout.height} role="img" aria-label="Frontend architecture DAG">
          {layout.edges.map((e) => (
            <line
              key={`${e.from}->${e.to}`}
              x1={e.sourceX}
              y1={e.sourceY}
              x2={e.targetX}
              y2={e.targetY}
              stroke={e.isBackEdge ? theme.stroke.tertiary : theme.stroke.primary}
              strokeWidth={1.5}
              strokeDasharray={e.isBackEdge ? '4 4' : undefined}
            />
          ))}

          {layout.nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <rect
                width={268}
                height={42}
                rx={10}
                fill={theme.fill.secondary}
                stroke={theme.stroke.secondary}
                strokeWidth={1}
              />
              <text
                x={12}
                y={26}
                fontSize={12}
                fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
                fill={theme.text.primary}
              >
                {n.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <Divider />

      <H2>Route map (logical)</H2>
      <Text size="small" tone="secondary">
        <Code>/</Code> Home · <Code>/about</Code> About+Contact · <Code>/live</Code> Live · <Code>/news</Code> News ·{' '}
        <Code>/news/:id</Code> Article · <Code>/library</Code> Library · <Code>/programs</Code> Programs ·{' '}
        <Code>/service</Code> Services · <Code>/donations</Code> Donations · <Code>/hospitals</Code> Hospitals ·{' '}
        <Code>/consultations</Code> Consultations · <Code>/pharmacies</Code> Pharmacies · <Code>/ambulances</Code>{' '}
        Ambulances · <Code>/accommodations</Code> Housing
      </Text>
    </Stack>
  );
}
