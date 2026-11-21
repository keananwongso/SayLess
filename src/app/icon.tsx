import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#d8fa77",
      color: "#1c240c",
      fontSize: 40,
      fontWeight: 800,
      letterSpacing: "-3px",
    }}>
      S.
    </div>,
    size,
  );
}
