import React, { useId } from 'react';

export interface BrandWaveProps {
  /** Color of the wave stroke. Supports hex, rgb, or CSS variables. Default: var(--color-orange-primary, #F68621) */
  color?: string;
  /** Height of the wave element in pixels. Default: 22 */
  height?: number;
  /** Width of a single repeating wave cycle in pixels. Default: 48 */
  unitWidth?: number;
  /** Thickness of the wave line stroke in pixels. Default: 3.5 */
  strokeWidth?: number;
  /** Opacity of the wave (0 to 1). Default: 1 */
  opacity?: number;
  /** Optional slow horizontal drifting animation */
  animated?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * BrandWave Component
 * 
 * Renders the signature 60FRAMEWORKS curved scallop/wave line pattern.
 * Uses an SVG pattern for crisp, pixel-perfect responsiveness across all screen sizes
 * and fully dynamic color control without needing raster images.
 */
export const BrandWave: React.FC<BrandWaveProps> = ({
  color = 'var(--color-orange-primary, #F68621)',
  height = 22,
  unitWidth = 48,
  strokeWidth = 3.5,
  opacity = 1,
  animated = false,
  className = '',
  style = {},
}) => {
  const rawId = useId();
  const patternId = `wave-pattern-${rawId.replace(/:/g, '')}`;

  // SVG path coordinates scaled to unitWidth and height
  // S-curved scallop arches from (0, base) over crest (half, top) to (unit, base)
  const half = unitWidth / 2;
  const c1 = unitWidth * 0.25;
  const c2 = unitWidth * 0.75;
  const pad = strokeWidth;
  const baseY = height - pad;
  const crestY = pad;

  const pathD = `M 0 ${baseY} C ${c1} ${baseY} ${c1} ${crestY} ${half} ${crestY} C ${c2} ${crestY} ${c2} ${baseY} ${unitWidth} ${baseY}`;

  return (
    <div
      className={`brand-wave-container ${animated ? 'brand-wave-animated' : ''} ${className}`.trim()}
      style={{
        width: '100%',
        height: `${height}px`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        opacity,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 1000 ${height}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <pattern
            id={patternId}
            width={unitWidth}
            height={height}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height={height} fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

export default BrandWave;
