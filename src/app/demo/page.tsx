import type { Metadata } from "next";
import "./guided-demo.css";
import { GuidedDemo } from "./guided-demo";

export const metadata: Metadata = {
  title: "SayLess | Guided demo",
  description: "Meet a sample speaker, discover their habits, and hear how their pitch changes after one retry.",
};

export default function DemoPage() {
  return <GuidedDemo />;
}
