import { createFileRoute } from "@tanstack/react-router";
import { CataloguePage } from "@/components/catalogue-page";

export const Route = createFileRoute("/")({ component: CataloguePage });
