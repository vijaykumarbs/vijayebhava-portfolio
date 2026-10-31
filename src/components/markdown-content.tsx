import { createElement, Fragment, type ReactNode } from "react";

type SafeHastNode = {
  type?: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: SafeHastNode[];
};

const allowedElements = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "a", "ul", "ol", "li",
  "strong", "em", "del", "blockquote", "pre", "code", "hr", "br", "img",
  "table", "thead", "tbody", "tr", "th", "td", "sup", "sub",
]);

function renderNode(node: SafeHastNode, key: string): ReactNode {
  if (node.type === "text") return typeof node.value === "string" ? node.value : null;
  const children = node.children?.map((child, index) => renderNode(child, `${key}-${index}`)) ?? [];
  if (node.type === "root") return <Fragment key={key}>{children}</Fragment>;
  if (node.type !== "element" || !node.tagName || !allowedElements.has(node.tagName)) return <Fragment key={key}>{children}</Fragment>;

  const properties = node.properties ?? {};
  const elementProps: Record<string, string | number> = {};
  if (typeof properties.id === "string") elementProps.id = properties.id;
  if (typeof properties.title === "string") elementProps.title = properties.title;
  if (node.tagName === "a" && typeof properties.href === "string") elementProps.href = properties.href;
  if (node.tagName === "img") {
    const src = properties.src;
    if (typeof src !== "string" || !src.startsWith("/blog/")) return null;
    elementProps.src = src;
    if (typeof properties.alt === "string") elementProps.alt = properties.alt;
    elementProps.loading = "lazy";
  }
  if ((node.tagName === "td" || node.tagName === "th") && typeof properties.align === "string") {
    if (["left", "center", "right"].includes(properties.align)) elementProps.align = properties.align;
  }
  if (node.tagName === "code" && Array.isArray(properties.className)) {
    const language = properties.className.find((value): value is string => typeof value === "string" && /^language-[a-z0-9_+-]+$/i.test(value));
    if (language) elementProps.className = language;
  }

  return createElement(node.tagName, { ...elementProps, key }, ...children);
}

export function MarkdownContent({ tree }: { tree: unknown }) {
  if (!tree || typeof tree !== "object") return null;
  return <div className="blog-content">{renderNode(tree as SafeHastNode, "markdown-root")}</div>;
}
