import React from "react";
import { renderMarp } from "../utils/marpRender";

interface PresentationViewerProps {
  markdown: string;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({
  markdown,
}) => {
  const { html } = renderMarp(markdown);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default PresentationViewer;
