import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getLaunchById } from "@/lib/services";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

const interRegular = readFileSync(
  join(process.cwd(), "public/fonts/Inter/Inter_28pt-Regular.ttf"),
);
const interSemiBold = readFileSync(
  join(process.cwd(), "public/fonts/Inter/Inter_28pt-SemiBold.ttf"),
);
const interBold = readFileSync(
  join(process.cwd(), "public/fonts/Inter/Inter_28pt-Bold.ttf"),
);
const baseNeue = readFileSync(
  join(process.cwd(), "public/fonts/BaseNeue/BaseNeueTrial-Bold.ttf"),
);
const loginBg = readFileSync(join(process.cwd(), "public/images/login-bg.png"));
const loginBgBase64 = `data:image/png;base64,${loginBg.toString("base64")}`;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const launch = await getLaunchById(id);

  if (!launch) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#09090b",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 52px",
        fontFamily: "inter-regular",
      }}
    >
      {/* Top: branding */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "14px",
            color: "#71717a",
            letterSpacing: "0.08em",
            fontFamily: "base",
          }}
        >
          IndieBuilds
        </span>
      </div>

      {/* Middle: project info + image */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          alignItems: "center",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            flex: 1,
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#ffffff",
              margin: "0",
              lineHeight: "1.1",
              fontFamily: "inter-bold",
            }}
          >
            {launch.name}
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#a1a1aa",
              margin: "0",
              lineHeight: "1.5",
              fontFamily: "inter-semibold",
            }}
          >
            {launch.tagline}
          </p>

          {/* Stack tags */}
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            {launch.stack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: "13px",
                  background: "#18181b",
                  color: "#a1a1aa",
                  border: "1px solid #3f3f46",
                  borderRadius: "6px",
                  padding: "4px 12px",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <img
          src={loginBgBase64}
          style={{ width: "400px", height: "400px", borderRadius: "10px", objectFit: "cover" }}
          loading="lazy"
        />
      </div>

      {/* Bottom: builder + stats */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #27272a",
          paddingTop: "24px",
        }}
      >
        {/* Builder */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {launch.user.image ? (
            <img
              src={launch.user.image}
              width={60}
              height={60}
              style={{ borderRadius: "50%" }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {launch.user.name?.[0] ?? "?"}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "17px", color: "#e4e4e7" }}>
              @{launch.user.githubHandle ?? launch.user.name}
            </span>
            <span style={{ fontSize: "14px", color: "#52525b" }}>
              {launch.week.id}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <span
              style={{ fontSize: "35px", fontWeight: "bold", color: "#C27AFF" }}
            >
              {launch._count.votes}
            </span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>votes</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <span
              style={{ fontSize: "35px", fontWeight: "bold", color: "#e4e4e7" }}
            >
              {launch._count.comments}
            </span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>comments</span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "inter-regular", data: interRegular, style: "normal" },
        { name: "inter-semibold", data: interSemiBold, style: "normal" },
        { name: "inter-bold", data: interBold, style: "normal" },
        { name: "base", data: baseNeue, style: "normal" },
      ],
    },
  );
}
