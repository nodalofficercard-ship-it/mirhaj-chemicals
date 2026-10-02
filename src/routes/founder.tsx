import { createFileRoute } from "@tanstack/react-router";
import { FounderPage } from "@/components/catalogue-page";

export const Route = createFileRoute("/founder")({
  component: FounderPage,
});
