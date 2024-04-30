import express from "express";
import multer from "multer";
import moment from "moment";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import users from "./users.mjs";
import { v4 as uuidv4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const defaultData = {users: [], products: []};
const db = new Low( new JSONFile("./db.json") ,defaultData);
await db.read();

dotenv.config();
const secretKey = process.env.SECRET_KEY_LOGIN;
const upload = multer();

const whiteList = ["http://localhost:5500", "http://127.0.0.1:5500"];
const corsOptions = {
  credentials: true,
  // origin: function(){
  //    可以簡寫
  // }

  origin(origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("不允許傳遞資料"));
    }
  },
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("網站首頁");
});

app.get("/api/products", (req, res) => {
  res.status(200).json({message: "獲取所有產品"});
});

app.post("/api/products", upload.none(), (req, res) => {
  res.status(201).json({message: "新增一個產品"});
});

// app.post("/api/users/login", upload.none(), (req, res) => {
//   const { account, password } = req.body;
//   // let user = users.find(u => u.account === account && u.password === password);
//   let user = db.data.users.find(u => u.account === account && u.password === password);
//   if (user) {
//     const token = jwt.sign({
//       account: user.account,
//       name: user.name,
//       mail: user.mail,
//       head: user.head
//     }, secretKey, {
//       expiresIn: "30m"
//     })
//     res.status(200).json({
//       status: "success",
//       token
//     });
//   } else {
//     res.status(400).json({
//         status: "error",
//         message: "使用者找不到、帳號或密碼錯誤"
//       });
//   }
//   // res.status(200).json({ message: "使用者登入", account, password });
// });

// app.post("/api/users/logout", checkToken, (req, res) => {
//   // res.status(200).json({ message: "使用者登出" });

//   const token = jwt.sign({
//     account: undefined,
//     name: undefined,
//     mail: undefined,
//     head: undefined
//   }, secretKey, {
//     expiresIn: "-10s"
//   })
//   res.status(200).json({
//     status: "success",
//     token
//   });
// });

// app.get("/api/users/status", checkToken, (req, res) => {
//   // res.status(200).json({ message: "檢查使用者登入登出狀態" });

//   // const user = users.find(u => u.account === req.decoded.account);
//   const user = db.data.users.find((u) => u.account === account && u.password === password);
//   if (user) {
//     const token = jwt.sign({
//       account: user.account,
//       name: user.name,
//       mail: user.mail,
//       head: user.head
//     }, secretKey, {
//       expiresIn: "30m"
//     })
//     res.status(200).json({
//       status: "success",
//       token
//     });
//   } else {
//     res.status(400).json({
//         status: "fail",
//         message: "使用者找不到、帳號錯誤"
//       });
//   }
// });

app.get("/api/products/search", (req, res) => {
  const id = req.query.id;
  res.status(200).json({message: `使用 ID 作為搜尋條件來搜尋產品 ${id}`});
});

app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({message: `獲取特定 ID 的產品 ${id}`});
});

app.put("/api/products/:id", upload.none(), (req, res) => {
  const id = req.params.id;
  res.status(200).json({message: `更新特定 ID 的產品 ${id}`});
});

app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({message: `刪除特定 ID 的產品 ${id}`});
});


app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});

// function productSearch(req){
//   return new Promise((resolve, reject) => {
//     const id = req.query.id;
//     let result = db.data.products.find( u => u.id === id);
//     if(result){
//       resolve(result);
//     }else{
//       reject(new Error("找不到相對應的資料"));
//     }
//   });
// }

// function productDelete(req){
//   return new Promise( async (resolve, reject) => {
//     const id = req.params.id;
//     const { id: idToken } = req.decoded;
//     if(id !== idToken){
//       return reject(new Error("沒有權限"));
//     }
//     let product = db.data.products.find(u => u.id === id);
//     db.data.products = db.data.products.filter(u => u.id !== id);
//     await db.write();
//     resolve(product);
//   });
// }

// function productUpdate(req){
//   return new Promise(async (resolve, reject) => {
//     const id = req.params.id;
//     const { title, price, stock} = req.body;
//     const { id: idToken } = req.decoded;
//     if(id !== idToken){
//       return reject(new Error("沒有權限"));
//     }
//     let product = db.data.products.find(u => u.id === id);
//     if(product){
//       Object.assign(product, {title, price, stock});
//       await db.write();
//       resolve(product);
//     }
//   });
// }

// function productAdd(req){
//   return new Promise(async (resolve, reject) => {
//     const { title, price, stock, createTime} = req.body;
//     let result = db.data.products.find(u => u.title === title);
//     if(result){
//       return reject(new Error("菜已經有人賣了"));
//     }
//     const id = uuidv4();
//     db.data.products.push({id, title, price, stock, createTime});
//     await db.write();
//     resolve(id);
//   });
// }

// function userSingle(req){
//   return new Promise((resolve, reject) => {
//     const id = req.params.id;
//     let result = db.data.users.find((u) => u.id === id);
//     if(result){
//       resolve(result);
//     }else{
//       reject(new Error("找不到產品"))
//     }
//   });
// }

// function usersAll(){
//   return new Promise((resolve, reject) => {
//     let users = db.data.users;
//     if(users){
//       resolve(users);
//     }else{
//       reject(new Error("找不到產品"));
//     }
//   });
// }


// function checkToken (req, res, next){
//   let token = req.get("Authorization");
//   if(token && token.startsWith("Bearer ")){
//     token = token.slice(7);
//     jwt.verify(token, secretKey, (err, decoded) => {
//       if(err){
//         return res.status(401).json({
//           status: "error",
//           message: "登入驗證失效，請重新登入"
//     });
//       }
//       req.decoded = decoded;
//       next();
//     });
//   }else{
//     return res.status(401).json({
//       status: "error",
//       message: "無登入驗證資料，請重新登入"
//     });
//   }
// }
