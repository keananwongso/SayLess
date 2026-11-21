import type { Metadata } from "next";
import "./guided-demo.css";
import { GuidedDemo } from "./guided-demo";

export const metadata: Metadata = {
  title: "SayLess | Guided demo",
  description: "Try Jade’s simulated upload, see her Yap Recap and two-week goal, then open SayLess.",
};

export default function DemoPage() {
  return (
    <div className="handset">
      <GuidedDemo />
    </div>
  );
}
