import React, { useId } from 'react';

export interface BrandWaveProps {
  /** Color of the wave pattern. Supports hex, rgb, or CSS variables. Default: var(--color-orange-primary, #F68621) */
  color?: string;
  /** Height of the wave element in pixels. Default: 24 */
  height?: number;
  /** Width of a single repeating arch cycle in pixels. Default: 48 */
  unitWidth?: number;
  /** Opacity of the wave (0 to 1). Default: 1 */
  opacity?: number;
  /** Optional subtle horizontal drifting animation */
  animated?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * BrandWave Component
 * 
 * Renders the authentic 60FRAMEWORKS signature arch pattern:
 * alternating downward and upward semicircular ribbon arches meeting flat at the centerline.
 */
export const BrandWave: React.FC<BrandWaveProps> = ({
  color = 'var(--color-orange-primary, #F68621)',
  height = 24,
  unitWidth,
  opacity = 1,
  animated = false,
  className = '',
  style = {},
}) => {
  const rawId = useId();
  const patternId = `brand-arch-pattern-${rawId.replace(/:/g, '')}`;

  // Preserve 2:1 aspect ratio so semicircular arches remain perfectly circular
  const actualUnitWidth = unitWidth || height * 2;

  // Authentic pattern:
  // - Downward arch: outer radius 12, inner radius 6, thickness 6 (y: 12 -> 24)
  // - Upward arch: outer radius 12, inner radius 6, thickness 6 (y: 0 -> 12)
  // - Ends cut flat at midline y=12 and touch seamlessly at x=24
  const pathD = "M 0 12 A 12 12 0 0 0 24 12 H 18 A 6 6 0 0 1 6 12 H 0 Z M 24 12 A 12 12 0 0 1 48 12 H 42 A 6 6 0 0 0 30 12 H 24 Z";

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
            width={actualUnitWidth}
            height={height}
            viewBox="0 0 48 24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d={pathD}
              fill={color}
            />
          </pattern>
        </defs>
        <rect width="100%" height={height} fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

export default BrandWave;

