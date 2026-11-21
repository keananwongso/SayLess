import type { Metadata } from "next";
import "./guided-demo.css";
import { GuidedDemo } from "./guided-demo";

export const metadata: Metadata = {
  title: "SayLess | Guided demo",
  description: "Follow Jade from a simulated upload to Yap Recap, a two-week goal, and a daily check-in with a friend.",
};

export default function DemoPage() {
  return (
    <div className="demo-device">
      <GuidedDemo />
    </div>
  );
}
