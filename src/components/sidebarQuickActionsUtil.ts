// Utility to flatten sidebar menu items for quick actions
import { menuItems } from "./Sidebar";

export interface SidebarQuickAction {
  title: string;
  icon: React.ComponentType<any>;
  path: string;
}



export function getSidebarQuickActions(): SidebarQuickAction[] {
  const actions: SidebarQuickAction[] = [];
  function traverse(items: any[]) {
    for (const item of items) {
      if (item.path && item.label && item.icon) {
        actions.push({ title: item.label, icon: item.icon, path: item.path });
      }
      if (item.children) traverse(item.children);
    }
  }
  traverse(menuItems);
  return actions;
}
