import type { Metadata } from "next";
import "./guided-demo.css";
import { GuidedDemo } from "./guided-demo";

export const metadata: Metadata = {
  title: "SayLess | Guided demo",
  description: "Meet Jade and follow her first SayLess session, from Communication Wrapped to one pitch retry.",
};

export default function DemoPage() {
  return <GuidedDemo />;
}
