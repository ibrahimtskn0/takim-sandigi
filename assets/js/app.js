import { initMenu } from "./menu.js";
import { renderNavigation } from "./navigation.js";
import { initRouter } from "./router.js";
import { initTheme } from "./theme.js";

initTheme();
initMenu();
renderNavigation();
initRouter();