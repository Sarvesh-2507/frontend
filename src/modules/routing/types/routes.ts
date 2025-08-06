// Route Types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  protected?: boolean;
  exact?: boolean;
  title?: string;
}

export interface ModuleRoute {
  module: string;
  routes: RouteConfig[];
}
