import { Text, View, Link } from '@react-pdf/renderer';

type DeltaOp = { insert: string | object; attributes?: Record<string, any> };
type Delta = { ops: DeltaOp[] };

type Segment = { text: string; attrs?: Record<string, any> };
type Line = { segments: Segment[]; lineAttrs?: Record<string, any> };

function groupLines(delta: Delta): Line[] {
  const lines: Line[] = [];
  let currentSegments: Segment[] = [];
  let orderedIndex = 1;

  const flushLine = (lineAttrs?: Record<string, any>) => {
    if (currentSegments.length === 0) currentSegments.push({ text: '' });
    lines.push({ segments: currentSegments, lineAttrs });
    currentSegments = [];
  };

  for (const op of delta.ops || []) {
    const insert = op.insert;
    const attrs = op.attributes || {};

    if (typeof insert === 'string') {
      const parts = insert.split('\n');
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.length) {
          currentSegments.push({ text: part, attrs });
        }
        const isLineBreak = i < parts.length - 1;
        if (isLineBreak) {
          // Line attributes apply to the newline op (Quill convention)
          flushLine(attrs);
          if (!attrs.list) orderedIndex = 1;
          else if (attrs.list === 'ordered') orderedIndex += 1;
        }
      }
    } else {
      // Skip embeds for now
    }
  }

  // Flush trailing content if any
  if (currentSegments.length) flushLine();

  // Attach running index to ordered list lines
  let counter = 1;
  return lines.map((line) => {
    if (line.lineAttrs?.list === 'ordered') {
      const withIndex = { ...line };
      // Store index on lineAttrs for rendering
      withIndex.lineAttrs = { ...line.lineAttrs, index: counter };
      counter += 1;
      return withIndex;
    }
    if (!line.lineAttrs?.list) counter = 1;
    return line;
  });
}

function mergeInlineStyle(
  attrs: Record<string, any> | undefined,
  baseStyle: any
): any {
  const style: any = { ...(baseStyle || {}) };
  if (!attrs) return style;
  if (attrs.bold) style.fontWeight = 'bold';
  if (attrs.italic) style.fontStyle = 'italic';
  if (attrs.underline) style.textDecoration = 'underline';
  return style;
}

export function PdfDelta({
  delta,
  paragraphStyle,
  listItemStyle,
  bulletStyle,
}: {
  delta?: Delta;
  paragraphStyle?: any;
  listItemStyle?: any;
  bulletStyle?: any;
}) {
  if (!delta || !delta.ops || delta.ops.length === 0) return null;

  const lines = groupLines(delta);

  return (
    <View>
      {lines.map((line, i) => {
        const list = line.lineAttrs?.list as 'bullet' | 'ordered' | undefined;

        if (list) {
          const idx = line.lineAttrs?.index as number | undefined;
          return (
            <View key={i} style={{ flexDirection: 'row' }}>
              <Text style={bulletStyle}>
                {list === 'bullet' ? '•' : `${idx ?? i + 1}.`}
              </Text>
              <Text style={listItemStyle}>
                {line.segments.map((seg, j) => {
                  const style = mergeInlineStyle(seg.attrs, listItemStyle);
                  if (seg.attrs?.link) {
                    return (
                      <Link key={j} src={seg.attrs.link} style={style}>
                        {seg.text}
                      </Link>
                    );
                  }
                  return (
                    <Text key={j} style={style}>
                      {seg.text}
                    </Text>
                  );
                })}
              </Text>
            </View>
          );
        }

        return (
          <Text key={i} style={paragraphStyle}>
            {line.segments.map((seg, j) => {
              const style = mergeInlineStyle(seg.attrs, paragraphStyle);
              if (seg.attrs?.link) {
                return (
                  <Link key={j} src={seg.attrs.link} style={style}>
                    {seg.text}
                  </Link>
                );
              }
              return (
                <Text key={j} style={style}>
                  {seg.text}
                </Text>
              );
            })}
          </Text>
        );
      })}
    </View>
  );
}