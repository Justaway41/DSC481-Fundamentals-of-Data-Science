import { Marp } from "@marp-team/marp-core";

export function renderMarp(markdown: string) {
  const marp = new Marp({ script: true });
  const { html, css, comments } = marp.render(markdown);
  return { html, css, comments };
}
