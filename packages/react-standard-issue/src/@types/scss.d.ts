declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
declare module "*.module.css" {
  const classes: { [className: string]: string };
  export default classes;
}
declare module "*.module.scss" {
  const classes: { [className: string]: string };
  export default classes;
}
