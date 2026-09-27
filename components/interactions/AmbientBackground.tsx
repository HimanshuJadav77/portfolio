"use client";

export default function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 select-none"
      aria-hidden="true"
    >
      {/* Top-right warm coral ambient glow */}
      <div
        className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 94, 54, 0.045) 0%, rgba(255, 94, 54, 0.012) 45%, transparent 70%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Mid-left subtle purple ambient glow */}
      <div
        className="absolute top-[40%] -left-36 w-[550px] h-[550px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.035) 0%, rgba(168, 85, 247, 0.008) 45%, transparent 70%)",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
