import { Thoth } from "../src/index.ts";
const thoth = new Thoth({
  overrideConsole: true,
});

thoth.log(process.env);

const topLevel = thoth.log("this is the top level 👍");
topLevel._log("This is an actual child")._log("grandchild").log("grandchild 2");
topLevel.log("this is a log 1");
topLevel.log("this is a log 2");

const rootLevel = thoth.log("Root level");
const firstLevel = rootLevel
  ._log("First level 1")
  .log("First level 2")
  .log("First level 3");
const secondLevel = firstLevel
  ._log("Second level 1")
  .log("Second level 2")
  .log("Second level 3");
secondLevel._log("Third Level -2")._log("Fourth Level 1").log("Fourth Level 2");
secondLevel._log("Third Level -1");
const level4 = rootLevel._log("First level 4");
level4._log("Third level 1").log("Third level 2").log("Third level 3");
level4.log("First level 5").log("First level 6");
secondLevel.log("Second level 4").log("Second level 5").log("Second level 6");
const firstLevel2 = thoth
  ._log("Root Level 2")
  ._log("First Level 1")
  ._log("Second Level 1")
  ._log("Third Level 1")
  .log("Third Level 2")
  ._log("Fourth Level 1")
  ._log("Fifth Level 1")
  ._log("Sixth Level 1")
  ._log("Seventh Level 1")
  ._log("Eighth Level 1")
  ._log("Ninth Level 1")
  ._log("Tenth Level 1");
const root = thoth.log("Root Node");
const level1 = root
  // .$log("Level 1 - Branch 1")
  .log("Level 1 - Branch 2")
  ._log("Level 1 - Branch 3");
const level2Branch1 = level1
  ._log("Level 2 - Branch 1.1")
  .log("Level 2 - Branch 1.2")
  ._log("Level 2 - Branch 1.3");
const level2Branch2 = level1
  .log("Level 2 - Branch 2.1")
  ._log("Level 2 - Branch 2.2")
  .log("Level 2 - Branch 2.3");
const level3Branch1 = level2Branch1
  ._log("Level 3 - Branch 1.1.1")
  ._log("Level 3 - Branch 1.1.2")
  .log("Level 3 - Branch 1.1.3");
const level3Branch2 = level2Branch2
  .log("Level 3 - Branch 2.1.1")
  ._log("Level 3 - Branch 2.1.2")
  ._log("Level 3 - Branch 2.1.3")
  ._log("Level 3 - Branch 2.1.4");
const deepBranch = level3Branch1
  ._log("Level 4 - Deep Branch 1.1.1.1")
  ._log("Level 5 - Deepest Branch 1.1.1.1.1")
  .log("Level 5 - Deepest Branch 1.1.1.1.2")
  ._log("Level 6 - Even Deeper Branch 1.1.1.1.1.1");
deepBranch
  ._log("Level 7 - Complex Node 1")
  .log("Level 7 - Complex Node 2")
  .log("Level 7 - Complex Node 3");
const level4Branch2 = level3Branch2
  .log("Level 4 - Branch 2.1.1.1")
  .log("Level 4 - Branch 2.1.1.2")
  ._log("Level 4 - Branch 2.1.1.3");
level4Branch2
  ._log("Level 5 - Branch 2.1.1.3.1")
  ._log("Level 6 - Deep Leaf 2.1.1.3.1.1");
const rootLevel2 = root
  ._log("Root Level 2 - Branch A")
  ._log("Root Level 2 - Branch B")
  ._log("Root Level 2 - Branch C");
rootLevel2
  ._log("Level 1 - Sub Branch A1")
  .log("Level 1 - Sub Branch A2")
  ._log("Level 1 - Sub Branch A3")
  .log("Level 2 - Deep Branch A3.1");
const massiveNode = rootLevel2
  ._log("Massive Branch 1")
  ._log("Massive Branch 2")
  ._log("Massive Branch 3");
massiveNode
  .log("Level 3 - Broad Expansion")
  .log("Level 4 - Broad Expansion 1")
  ._log("Level 5 - Broad Expansion Deep")
  ._log("Level 6 - Ultimate Depth");

thoth.log([1, 2, 3, 4]);

thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);
thoth.log(
  "The Tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
);

const secondMessage = thoth.log("Second message. This will update!");

thoth.log(process.env);

const topLevel2 = thoth.log("this is the top level 👍");
topLevel._log("This is an actual child")._log("grandchild").log("grandchild 2");
topLevel.log("this is a log 1");
topLevel.log("this is a log 2");

const rootLevel23 = thoth.log("Root level");
const firstLevel22 = rootLevel2
  ._log("First level 1")
  .log("First level 2")
  .log("First level 3");
const secondLevel2 = firstLevel
  ._log("Second level 1")
  .log("Second level 2")
  .log("Second level 3");
secondLevel._log("Third Level -2")._log("Fourth Level 1").log("Fourth Level 2");
secondLevel._log("Third Level -1");
const level42 = rootLevel._log("First level 4");
level4._log("Third level 1").log("Third level 2").log("Third level 3");
level4.log("First level 5").log("First level 6");
secondLevel.log("Second level 4").log("Second level 5").log("Second level 6");
const firstLevel222 = thoth
  ._log("Root Level 2")
  ._log("First Level 1")
  ._log("Second Level 1")
  ._log("Third Level 1")
  .log("Third Level 2")
  ._log("Fourth Level 1")
  ._log("Fifth Level 1")
  ._log("Sixth Level 1")
  ._log("Seventh Level 1")
  ._log("Eighth Level 1")
  ._log("Ninth Level 1")
  ._log("Tenth Level 1");
const root2 = thoth.log("Root Node");
const level12 = root2
  // .$log("Level 1 - Branch 1")
  .log("Level 1 - Branch 2")
  ._log("Level 1 - Branch 3");
const level2Branch12 = level12
  ._log("Level 2 - Branch 1.1")
  .log("Level 2 - Branch 1.2")
  ._log("Level 2 - Branch 1.3");
const level2Branch22 = level1
  .log("Level 2 - Branch 2.1")
  ._log("Level 2 - Branch 2.2")
  .log("Level 2 - Branch 2.3");
const level3Branch12 = level2Branch12
  ._log("Level 3 - Branch 1.1.1")
  ._log("Level 3 - Branch 1.1.2")
  .log("Level 3 - Branch 1.1.3");
const level3Branch22 = level2Branch22
  .log("Level 3 - Branch 2.1.1")
  ._log("Level 3 - Branch 2.1.2")
  ._log("Level 3 - Branch 2.1.3")
  ._log("Level 3 - Branch 2.1.4");
const deepBranch2 = level3Branch12
  ._log("Level 4 - Deep Branch 1.1.1.1")
  ._log("Level 5 - Deepest Branch 1.1.1.1.1")
  .log("Level 5 - Deepest Branch 1.1.1.1.2")
  ._log("Level 6 - Even Deeper Branch 1.1.1.1.1.1");
deepBranch2
  ._log("Level 7 - Complex Node 1")
  .log("Level 7 - Complex Node 2")
  .log("Level 7 - Complex Node 3");
const level4Branch22 = level3Branch22
  .log("Level 4 - Branch 2.1.1.1")
  .log("Level 4 - Branch 2.1.1.2")
  ._log("Level 4 - Branch 2.1.1.3");
level4Branch22
  ._log("Level 5 - Branch 2.1.1.3.1")
  ._log("Level 6 - Deep Leaf 2.1.1.3.1.1");
const rootLevel22 = root
  ._log("Root Level 2 - Branch A")
  ._log("Root Level 2 - Branch B")
  ._log("Root Level 2 - Branch C");
rootLevel22
  ._log("Level 1 - Sub Branch A1")
  .log("Level 1 - Sub Branch A2")
  ._log("Level 1 - Sub Branch A3")
  .log("Level 2 - Deep Branch A3.1");
const aslkdjalskd = rootLevel22
  ._log("Massive Branch 1")
  ._log("Massive Branch 2")
  ._log("Massive Branch 3");
massiveNode
  .log("Level 3 - Broad Expansion")
  .log("Level 4 - Broad Expansion 1")
  ._log("Level 5 - Broad Expansion Deep")
  ._log("Level 6 - Ultimate Depth");

thoth.log([1, 2, 3, 4]);

let i = 0;
setInterval(() => {
  secondMessage.update(`Second message. Re-rendered ${i++} times`);
}, 1000);
