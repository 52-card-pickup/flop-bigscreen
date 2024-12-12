import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import Home from "./pages/home";
import TV from "./pages/tv";
import { MatchFilters } from "@solidjs/router/dist/types";

const roomCodeFilters: MatchFilters = {
  roomCode: /^[A-Z]{4}$/i,
};

export const routes: RouteDefinition[] = [
  {
    path: "/:roomCode?",
    component: Home,
    matchFilters: roomCodeFilters,
  },
  {
    path: "/tv/:roomCode?",
    component: TV,
  },
  {
    path: "/big-screen/:roomCode?",
    component: Home,
    matchFilters: roomCodeFilters,
  },
  {
    path: "/big-screen/tv/:roomCode?",
    component: TV,
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
