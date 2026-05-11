import {
  Callout,
  computeDAGLayout,
  Divider,
  Grid,
  H1,
  H2,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from 'cursor/canvas';

export default function MachafiProjectWorkflow() {
  const theme = useHostTheme();

  const layout = computeDAGLayout({
    nodes: [
      { id: 'BrowserRouter' },
      { id: 'App shell' },
      { id: 'i18n provider (AR/FR/EN + dir)' },
      { id: 'Header/Footer (layout)' },
      { id: 'Pages (Home, Library, ...)' },
      { id: 'Mock data modules' },
      { id: 'services/ (future API boundary)' },
    ],
    edges: [
      { from: 'BrowserRouter', to: 'App shell' },
      { from: 'App shell', to: 'i18n provider (AR/FR/EN + dir)' },
      { from: 'i18n provider (AR/FR/EN + dir)', to: 'Header/Footer (layout)' },
      { from: 'i18n provider (AR/FR/EN + dir)', to: 'Pages (Home, Library, ...)' },
      { from: 'Mock data modules', to: 'Pages (Home, Library, ...)' },
      { from: 'services/ (future API boundary)', to: 'Pages (Home, Library, ...)' },
    ],
    direction: 'vertical',
    nodeWidth: 240,
    nodeHeight: 40,
    rankGap: 54,
    nodeGap: 18,
    padding: 12,
  });

  return (
    <Stack gap={20}>
      <Stack gap={6}>
        <H1>MACHAFI — rebuild workflow</H1>
        <Text tone="secondary">
          Directory-first health platform. UI-first rebuild: ship pixel-perfect pages using i18n + mock
          data, then wire APIs via a thin services layer.
        </Text>
      </Stack>

      <Grid columns={3} gap={12}>
        <Stat value="Done" label="Header + footer, Home, Library (UI-only)" tone="success" />
        <Stat value="In progress" label="Pixel-perfect tuning + RTL/LTR QA" tone="warning" />
        <Stat value="Planned" label="Hospitals as reference directory page" tone="info" />
      </Grid>

      <Callout tone="info" title="Tracking rule">
        Keep these updated after every prompt: <Codeish>PROJECT_STATUS.md</Codeish> and{' '}
        <Codeish>PROMPT_LOG.md</Codeish>. When a new page is created, add a dedicated <Codeish>*_MAP.md</Codeish>{' '}
        tracker and keep it current.
      </Callout>

      <Divider />

      <H2>Project memory (source of truth)</H2>
      <Table
        headers={['Doc', 'Purpose']}
        rows={[
          ['project-explainer.md', 'Product intent + directory-first philosophy'],
          ['PROJECT_STATUS.md', 'Done / in progress / remaining'],
          ['PROMPT_LOG.md', 'One entry per prompt (what changed)'],
          ['HOMEPAGE_MAP.md', 'Home sections map + rebuild notes'],
          ['LIBRARY_PAGE_MAP.md', 'Library page map + wiring plan'],
          ['HEADER_SCROLL_ANIMATION.md', 'Sticky header collapse spec + QA checklist'],
          ['LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md', 'Legacy blockers + rebuild rules'],
          ['HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md', 'Phased delivery plan'],
        ]}
      />

      <Divider />

      <H2>UI architecture (current → future)</H2>
      <div
        style={{
          border: `1px solid ${theme.stroke.secondary}`,
          background: theme.bg.elevated,
          borderRadius: 10,
          padding: 12,
          overflow: 'auto',
        }}
      >
        <svg width={layout.width} height={layout.height} role="img" aria-label="MACHAFI UI architecture DAG">
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
                width={240}
                height={40}
                rx={10}
                fill={theme.fill.secondary}
                stroke={theme.stroke.secondary}
                strokeWidth={1}
              />
              <text
                x={12}
                y={24}
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

      <H2>Current focus</H2>
      <Stack gap={8}>
        <Text>
          - Validate header scroll collapse (desktop + mobile) and verify RTL/LTR on Home + Library.
        </Text>
        <Text>
          - Build <Codeish>Hospitals</Codeish> as the reference directory page (filters → cards → empty states) on
          mock data, then clone patterns across Pharmacies/Ambulances/Housing/etc.
        </Text>
        <Text>
          - Keep UI “dumb”: no fetch/business logic inside components. Later: add a <Codeish>services/</Codeish>{' '}
          boundary for API wiring.
        </Text>
      </Stack>

      <Divider />

      <H2>Run the app</H2>
      <Stack gap={6}>
        <Text>
          Frontend lives in <Codeish>frontend/</Codeish> (Vite + React + Tailwind).
        </Text>
        <Text tone="secondary" size="small">
          Commands: <Codeish>npm install</Codeish>, <Codeish>npm run dev</Codeish>, <Codeish>npm run build</Codeish>
        </Text>
      </Stack>

      <Divider />

      <H2>Quick links</H2>
      <Stack gap={6}>
        <Text>
          Open the status doc: <Codeish>PROJECT_STATUS.md</Codeish>
        </Text>
        <Text>
          Open the prompt log: <Codeish>PROMPT_LOG.md</Codeish>
        </Text>
      </Stack>
    </Stack>
  );
}

function Codeish({ children }: { children: string }) {
  return <Text weight="semibold">{children}</Text>;
}
