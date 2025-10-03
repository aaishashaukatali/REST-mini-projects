const { v4: uuid4 } = require("uuid");
let data = [
  {
    id: uuid4(),
    username: "@apnacollege",
    content: "happy coding :)",
  },
  {
    id: uuid4(),
    username: "@neha sharma",
    content: "Good Morning!",
  },
  {
    id: uuid4(),
    username: "@rahul kumar",
    content: "Made for code",
  },
];

module.exports = data;
