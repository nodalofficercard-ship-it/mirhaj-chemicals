import { createFileRoute } from "@tanstack/react-router";
import { TeamDesk } from "@/components/team-desk";

export const Route = createFileRoute("/team")({
  component: TeamDesk,
});
