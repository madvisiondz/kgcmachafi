/**
 * Ambient typings for Cursor Canvas preview (`import … from 'cursor/canvas'`).
 * At runtime the IDE provides the module; this file satisfies the workspace TypeScript server.
 */
declare module 'cursor/canvas' {
  import type { CSSProperties, JSX, ReactNode } from 'react';

  export type DAGLayoutOptions = Record<string, unknown>;
  export type DAGLayoutResult = {
    width: number;
    height: number;
    nodes: Array<{ id: string; x: number; y: number; rank: number; order: number }>;
    edges: Array<{
      from: string;
      to: string;
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
      isBackEdge: boolean;
    }>;
    ranks: unknown[];
    direction: string;
  };

  export function computeDAGLayout(options: DAGLayoutOptions): DAGLayoutResult;

  export function useHostTheme(): {
    stroke: { secondary: string; primary: string; tertiary: string };
    bg: { elevated: string };
    fill: { secondary: string };
    text: { primary: string };
  };

  export function Stack(props: { children?: ReactNode; gap?: number; style?: CSSProperties }): JSX.Element;
  export function H1(props: { children?: ReactNode; style?: CSSProperties }): JSX.Element;
  export function H2(props: { children?: ReactNode; style?: CSSProperties }): JSX.Element;
  export function Text(props: {
    children?: ReactNode;
    tone?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
    size?: 'body' | 'small';
    weight?: string;
    style?: CSSProperties;
  }): JSX.Element;
  export function Divider(props?: { style?: CSSProperties }): JSX.Element;
  export function Code(props: { children?: ReactNode; style?: CSSProperties }): JSX.Element;

  /** `project-workflow.canvas.tsx` */
  export function Callout(props: {
    tone?: string;
    title?: ReactNode;
    children?: ReactNode;
    style?: CSSProperties;
  }): JSX.Element;
  export function Grid(props: {
    children?: ReactNode;
    columns?: number | string;
    gap?: number;
    style?: CSSProperties;
  }): JSX.Element;
  export function Stat(props: {
    value?: ReactNode;
    label?: ReactNode;
    tone?: string;
    style?: CSSProperties;
  }): JSX.Element;
  export function Table(props: {
    headers?: ReactNode[];
    rows?: ReactNode[][];
    style?: CSSProperties;
  }): JSX.Element;
}
