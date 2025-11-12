import React from 'react';
import { Text, View, Link } from '@react-pdf/renderer';

interface PdfHtmlProps {
  html: string;
  paragraphStyle?: any;
  listIndent?: number;
  linkColor?: string;
}

function renderInline(node: ChildNode, paragraphStyle?: any, linkColor?: string): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent || '').replace(/\s+/g, ' ');
    return <Text style={paragraphStyle}>{text}</Text>;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const children = Array.from(el.childNodes).map((n, i) => <React.Fragment key={i}>{renderInline(n, paragraphStyle, linkColor)}</React.Fragment>);
    switch (el.tagName.toLowerCase()) {
      case 'strong':
      case 'b':
        return <Text style={{ ...(paragraphStyle || {}), fontWeight: 'bold' }}>{children}</Text>;
      case 'em':
      case 'i':
        return <Text style={{ ...(paragraphStyle || {}), fontStyle: 'italic' }}>{children}</Text>;
      case 'u':
        return <Text style={{ ...(paragraphStyle || {}), textDecoration: 'underline' }}>{children}</Text>;
      case 'a': {
        const href = el.getAttribute('href') || '';
        return (
          <Link src={href} style={{ color: linkColor || '#2563eb', textDecoration: 'underline' }}>
            <Text style={paragraphStyle}>{children}</Text>
          </Link>
        );
      }
      case 'br':
        return <Text>{'\n'}</Text>;
      default:
        return children;
    }
  }
  return null;
}

export default function PdfHtml({ html, paragraphStyle, listIndent = 12, linkColor }: PdfHtmlProps) {
  // Basic HTML parsing using DOMParser; supports Quill’s p/ul/ol/li/strong/em/a/br
  const doc = typeof window !== 'undefined' ? new DOMParser().parseFromString(html, 'text/html') : null;
  if (!doc) return <Text style={paragraphStyle}>{html}</Text>;
  const bodyChildren = Array.from(doc.body.childNodes);

  const renderBlock = (node: ChildNode, index: number): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || '').trim();
      if (!text) return null;
      return (
        <View key={index} style={{ marginBottom: 4 }}>
          <Text style={paragraphStyle}>{text}</Text>
        </View>
      );
    }
    const el = node as HTMLElement;
    switch (el.tagName.toLowerCase()) {
      case 'p':
        return (
          <View key={index} style={{ marginBottom: 6 }}>
            <Text>{Array.from(el.childNodes).map((n, i) => <React.Fragment key={i}>{renderInline(n, paragraphStyle, linkColor)}</React.Fragment>)}</Text>
          </View>
        );
      case 'ul': {
        const items = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === 'li');
        return (
          <View key={index} style={{ marginBottom: 6, marginLeft: listIndent }}>
            {items.map((li, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 4, marginBottom: 2 }}>
                <Text>•</Text>
                <Text>
                  {Array.from(li.childNodes).map((n, j) => <React.Fragment key={j}>{renderInline(n, paragraphStyle, linkColor)}</React.Fragment>)}
                </Text>
              </View>
            ))}
          </View>
        );
      }
      case 'ol': {
        const items = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === 'li');
        return (
          <View key={index} style={{ marginBottom: 6, marginLeft: listIndent }}>
            {items.map((li, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 6, marginBottom: 2 }}>
                <Text>{`${i + 1}.`}</Text>
                <Text>
                  {Array.from(li.childNodes).map((n, j) => <React.Fragment key={j}>{renderInline(n, paragraphStyle, linkColor)}</React.Fragment>)}
                </Text>
              </View>
            ))}
          </View>
        );
      }
      case 'blockquote':
        return (
          <View key={index} style={{ borderLeftWidth: 2, borderLeftColor: '#e5e7eb', paddingLeft: 8, marginBottom: 6 }}>
            <Text>{Array.from(el.childNodes).map((n, i) => <React.Fragment key={i}>{renderInline(n, paragraphStyle, linkColor)}</React.Fragment>)}</Text>
          </View>
        );
      default:
        // Render unknown elements as paragraph
        return (
          <View key={index} style={{ marginBottom: 6 }}>
            <Text>{Array.from(el.childNodes).map((n, i) => <React.Fragment key={i}>{renderInline(n, paragraphStyle, linkColor)}</React.Fragment>)}</Text>
          </View>
        );
    }
  };

  return <View>{bodyChildren.map((n, i) => renderBlock(n, i))}</View>;
}