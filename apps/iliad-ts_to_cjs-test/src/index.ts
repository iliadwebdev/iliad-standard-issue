// import * as test from "@iliad.dev/ts-utils";
// import type { XOR } from "@iliad.dev/ts-utils";
import { XOR } from "@iliad.dev/ts-utils";
import { Hermes } from "@iliad.dev/hermes";

const a = new Hermes();

a.addBaseQuery("test");

a.fetch("https://lego.com").then((res) => {
  console.log(res);
});

// import "@iliad.dev/ts-utils";

// console.log("testing!", test.isString("test"));

type Testing = XOR<1, 2>;
type Testing2 = Falsy;
