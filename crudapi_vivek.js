const http = require("http");
const url = require("url");

const data = [];
const emailformat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordformat =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

const server = http.createServer((req, res) => {

  const { pathname, query } = url.parse(req.url, true);

  if (req.method == "POST" && req.url === "/user") {
    let bodydata = "";
    req.on("data", (chunk) => {
      bodydata += chunk;
    });

    req.on("end", () => {
      const { username, email, password } = JSON.parse(bodydata);
      const findelement = data.some((e) => e.username === username);

      if (!findelement) {
        if (!username == "" && !password == "") {
          if (email.match(emailformat) && password.match(passwordformat)) {
            data.push(JSON.parse(bodydata));
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ msg: "User created Sucessfully" }));
            res.end();
          } else {
            res.writeHead(409, { "Content-Type": "application/json" });
            res.write(
              JSON.stringify({
                msg: "Please Enter valid format of Email or password",
              })
            );
            res.end();
          }
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify({ msg: "Please Enter Username or Password!" })
          );
          res.end();
        }
      } else {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data));
        res.write(JSON.stringify({ msg: "User already exist" }));
        res.end();
      }
    });
  } else if (req.method == "GET" && req.url === "/user") {

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(data));
    res.end();

  } else if (req.method == "GET" &&pathname === "/user" &&query.username !== undefined) {

    const { username, email, password } = query;
    const findidxsearch = data.findIndex((e) => e.username === username);
    if (findidxsearch != -1) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(data[findidxsearch]));
      res.end();
    } else {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ msg: "User Is Not Exist!" }));
      res.end();
    }

  } else if (req.method == "PATCH" && req.url === "/user") {

    let bodydata = "";
    req.on("data", (chunk) => {
      bodydata += chunk;
    });
    req.on("end", () => {
      const { username, newusername } = JSON.parse(bodydata);

      const findidx = data.findIndex((e) => e.username === username);
      if (findidx != -1) {
        data[findidx].username = newusername;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ msg: "Username is changed!" }));

        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ msg: "User Is Not Exist!" }));
        res.end();
      }

    });
  } else if (req.method == "DELETE" && req.url === "/user") {

    let bodydata = "";
    req.on("data", (chunk) => {
      bodydata += chunk;
    });
    req.on("end", () => {
      const { username } = JSON.parse(bodydata);

      const findidx = data.findIndex((e) => e.username === username);
      if (findidx != -1) {
        data.splice(findidx, 1);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ msg: "User Data Is Delete!" }));

        res.end();
      } else {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ msg: "User Is Not Exist!" }));
        res.end();
      }
    });

  } 
  else
   {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ msg: "Page Not Found!" }));
    res.end();
  }
});

server.listen(8000, () => {
  console.log("server is running on port 8000");
});
