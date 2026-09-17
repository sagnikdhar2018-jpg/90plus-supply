import { COLORWAYS, FINISHES } from "@/data/colorways";
import { cn } from "@/lib/utils";

type Props = {
  colorway?: number;
  finish?: number;
  name?: string;
  number?: string;
  className?: string;
  size?: number;
};

export function BallOrb({ colorway = 0, finish = 0, name, number, className, size = 220 }: Props) {
  const cw = COLORWAYS[colorway % COLORWAYS.length];
  const fin = FINISHES[finish % FINISHES.length];
  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <div
        className="relative size-full overflow-hidden rounded-full shadow-[0_28px_50px_-18px_rgba(0,0,0,0.85)]"
        style={{
          background: `radial-gradient(circle at 32% 28%, ${cw.a} 0%, ${cw.b} 58%, #050607 100%)`,
        }}
      >
        <div
          className="absolute inset-[8%] rounded-full border"
          style={{ borderColor: `color-mix(in oklab, ${cw.a} 55%, transparent)`, opacity: 0.7 }}
        />
        <div className="absolute inset-y-[18%] left-1/2 w-px -translate-x-1/2 bg-fg/25" />
        <div className="absolute inset-x-[18%] top-1/2 h-px -translate-y-1/2 bg-fg/25" />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,${0.08 + fin.sheen * 0.18}) 0%, transparent 42%, rgba(0,0,0,0.35) 100%)`,
          }}
        />
        {(name || number) && (
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              {number ? (
                <div className="font-display text-3xl leading-none tracking-tight text-fg/90">{number}</div>
              ) : null}
              {name ? (
                <div className="mt-1 max-w-[70%] truncate font-mono text-[9px] uppercase tracking-[0.18em] text-fg/70">
                  {name}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
