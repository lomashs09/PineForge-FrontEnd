// Lightweight SVG charts — replaces recharts on Landing for ~200 KB
// gzip savings on the public bundle. Recharts stays in the lazy
// /backtest chunk where the full library's interactivity is needed.

const PAD = { top: 16, right: 8, bottom: 24, left: 44 };

function buildScales(data, valueKey, height, width, valueDomain) {
  const xs = data.map((_, i) => i);
  const ys = data.map((d) => d[valueKey]);
  const yMin = valueDomain ? valueDomain[0] : Math.min(...ys, 0);
  const yMax = valueDomain ? valueDomain[1] : Math.max(...ys);
  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const xScale = (i) => PAD.left + (xs.length === 1 ? innerW / 2 : (i / (xs.length - 1)) * innerW);
  const yScale = (v) => PAD.top + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;
  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / yTicks);
  return { xScale, yScale, ticks, yMin, yMax, innerW, innerH };
}

export function AreaSparkline({
  data,
  valueKey = 'eq',
  labelKey = 'm',
  height = 240,
  stroke = '#10b981',
  fillId = 'areaGrad',
  yFormat = (v) => v,
  valueDomain,
}) {
  const width = 600; // viewBox unit; SVG scales via preserveAspectRatio
  const { xScale, yScale, ticks } = buildScales(data, valueKey, height, width, valueDomain);

  const pathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d[valueKey])}`).join(' ');
  const areaD = `${pathD} L ${xScale(data.length - 1)} ${height - PAD.bottom} L ${xScale(0)} ${height - PAD.bottom} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.4" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines + y labels */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            x2={width - PAD.right}
            y1={yScale(t)}
            y2={yScale(t)}
            stroke="#1f2937"
            strokeDasharray="3 3"
          />
          <text
            x={PAD.left - 8}
            y={yScale(t)}
            fill="#6b7280"
            fontSize="11"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {yFormat(t)}
          </text>
        </g>
      ))}

      {/* x labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={xScale(i)}
          y={height - PAD.bottom + 14}
          fill="#6b7280"
          fontSize="11"
          textAnchor="middle"
        >
          {d[labelKey]}
        </text>
      ))}

      {/* area + line */}
      <path d={areaD} fill={`url(#${fillId})`} />
      <path d={pathD} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function BarSeries({
  data,
  valueKey = 'ret',
  labelKey = 'm',
  height = 240,
  positive = '#10b981',
  negative = '#ef4444',
  yFormat = (v) => `${v}%`,
}) {
  const width = 600;
  const ys = data.map((d) => d[valueKey]);
  const yMax = Math.max(...ys, 0);
  const yMin = Math.min(...ys, 0);
  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const yScale = (v) => PAD.top + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;
  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / yTicks);
  const barW = (innerW / data.length) * 0.55;
  const xCenter = (i) => PAD.left + (innerW / data.length) * (i + 0.5);
  const zeroY = yScale(0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" role="img" aria-hidden="true">
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            x2={width - PAD.right}
            y1={yScale(t)}
            y2={yScale(t)}
            stroke="#1f2937"
            strokeDasharray="3 3"
          />
          <text x={PAD.left - 8} y={yScale(t)} fill="#6b7280" fontSize="11" textAnchor="end" dominantBaseline="middle">
            {yFormat(t)}
          </text>
        </g>
      ))}

      {data.map((d, i) => {
        const v = d[valueKey];
        const barTop = v >= 0 ? yScale(v) : zeroY;
        const barH = Math.abs(yScale(v) - zeroY);
        const fill = v >= 0 ? positive : negative;
        return (
          <g key={i}>
            <rect
              x={xCenter(i) - barW / 2}
              y={barTop}
              width={barW}
              height={barH || 1}
              rx="3"
              fill={fill}
              opacity="0.9"
            />
            <text
              x={xCenter(i)}
              y={height - PAD.bottom + 14}
              fill="#6b7280"
              fontSize="11"
              textAnchor="middle"
            >
              {d[labelKey]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
