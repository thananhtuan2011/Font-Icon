# Guide to clone icons

**Clone `icons` folder and add it to your project**
*Suggestion*: Add `icons` folder in to `share` folder 

## Setting for font-icons
Import `fonts/font-icons/scss/font-icons.scss` in `style.scss` file 

*If using micro UI, call `generateFontFaceSjIcon()` in `constructor` for `app.component.ts`*
*Import `generateFontFaceSjIcon` form `fonts/font-icons/font-icons.ts`*


## Setting for skyjoy-icons
1. Import `SkyjoyIconsService` in `app.component.ts`,
2. Call `this.skyjoyIconsService.addIcons();` in `constructor` 
