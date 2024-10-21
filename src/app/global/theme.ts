const TRANS_TIME = "0.2s";
type ThemeType = 'dark'|'light';
interface ThemeTemplate {
    fontNunito:string;
    transDefault:string;
    colorWhite:string;
    colorText:string;
    colorBackground:string;
    colorElement:string;
    colorInput:string;
    theme:ThemeType;
    desktopMargin:string;
    colorButton:string;
    colorAccept:string;
    colorDecline: string;
}

class theme implements ThemeTemplate {
    fontNunito;
    transDefault;
    colorWhite;
    colorText;
    colorBackground;
    colorElement;
    colorInput;
    theme;
    desktopMargin;
    colorButton;
    colorAccept;
    colorDecline;
    constructor(textColor: string, backgroundColor: string, elementColor: string, inputColor: string, colorButton: string, theme: ThemeType) {
        this.colorText = textColor;
        this.colorBackground = backgroundColor;
        this.colorElement = elementColor;
        this.colorInput = inputColor;
        this.fontNunito = "\"Nunito Sans\", \"Arial\", sans-serif";
        this.transDefault = TRANS_TIME +  " ease";
        this.colorWhite = "hsl(0, 0%, 100%)";
        this.theme = theme;
        this.desktopMargin = '60px';
        this.colorButton = colorButton;
        this.colorAccept = "rgba(0, 180, 0, 1)";
        this.colorDecline = "rgba(203, 0, 0, 1)"
    }
}

const lightTheme = new theme(
    "hsl(200, 15%, 8%)",
    "hsl(0, 0%, 98%)",
    "hsl(0, 0%, 100%)",
    "hsl(0, 0%, 52%)",
    "rgba(111, 143, 175, 0.8)",
    'light',
)

const darkTheme = new theme(
    "hsl(0, 0%, 100%)",
    "hsl(207, 26%, 17%)",
    "hsl(209, 23%, 22%)",
    "hsl(0, 0%, 80%)",
    "hsl(210, 29%, 56%)",
    'dark',
)

export {lightTheme, darkTheme, TRANS_TIME, theme}
export type {ThemeType, ThemeTemplate};