// // This just holds the config and public API
// class Logger {

//     children: Array<Log> = [];
//     public readonly spinnerManager = SpinnerManager;

//     constructor() {
//       this.patchConsole();
//     }

//     private render() {
//       const renderedChildren = this.children.flatMap((child) => {
//         if (child.arbitraryIndex) return [];
//         return child.render();
//       });

//       const buffer = util.format(renderedChildren.join("\n"));

//       process.stdout.write("\x1Bc"); // Clear the console
//       process.stdout.write(buffer);
//       process.stdout.write("\n");
//     }

//     private addChild(child: Log) {
//       this.children.push(child);
//       this.update(); // Side effect to re-render the tree
//       return child;
//     }

//     get recursiveChildren(): Array<Log> {
//       const children = this.children.flatMap((child) => {
//         return child.recursiveChildren;
//       });

//       return children;
//     }

//     public log(message: string) {
//       const log = new Log(message, this);
//       return this.addChild(log);
//     }

//     public $log(message: string) {
//       const log = new PowerLog(message, this);
//       return this.addChild(log) as PowerLog;
//     }

//     public _$log(message: string) {
//       return this.$log(message);
//     }

//     public getChildrenByDepth(depth: number): Array<Log> {
//       return this.recursiveChildren.filter((child) => {
//         return child.depth === depth;
//       });
//     }

//     public getArbitraryChild(index: number): Log | undefined {
//       return this.children.find((child) => {
//         if (child.arbitraryIndex === undefined) return false;
//         return child.arbitraryIndex === index;
//       });
//     }

//     _log(message: string) {
//       return this.log(message);
//     }

//     public update() {
//       this.render();
//     }

//     private patchConsole() {
//       patchConsole((stream: any, data: any) => {
//         const arbitraryIndex = this.children.length;
//         const log = new Log(util.format(data) + "\n", this, arbitraryIndex);
//         this.addChild(log);
//       });
//     }
// }

// class Configuration {}

// class ThothDOM {}

// class Thoth extends Logger {
//   constructor() {
//     super();
//   }
// }
