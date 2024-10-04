import 'styled-components';
import { ThemeTemplate} from "@/app/global/theme";

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeTemplate {}
  }