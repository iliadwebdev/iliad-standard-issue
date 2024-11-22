type CSSModuleClasses = { [className: string]: string };

declare module "*.css" {
  const content: CSSModuleClasses;
  export default content;
}

declare module "*.module.css" {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module "*.module.scss" {
  const content: CSSModuleClasses;
  export default content;
}

declare module "*.scss" {
  const content: CSSModuleClasses;
  export default content;
}
