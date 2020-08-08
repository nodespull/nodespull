"use strict";
// import jwt from "jsonwebtoken"
// import strGen from "../../etc/system-tools/string-gen"
// export class JWT{
//     static verify = jwt.verify;
//     static secret = strGen(30);
//     static duration = "24h";
//     constructor(){
//     }
//     static checkToken(req:any, res:any, cb:Function){
//         let authorization = req.header("Authorization")
//         let token = authorization?req.header("Authorization").split(" ")[1]:undefined;
//         if (token) {
//             JWT.verify(token, JWT.secret, (err:any, decoded:any) => {
//                 if (err) {
//                     return res.status(401).json({
//                     success: false,
//                     message: 'Authorization Token is not valid'
//                     });
//                 } else {
//                     req["session"] = decoded;
//                     cb();
//                 }
//             });
//         } else {
//             return res.status(401).json({
//             success: false,
//             message: 'Authorization Token is not supplied'
//             });
//         }
//     };
//     static sign(data:any, duration?:string):JWT_Token{
//         return new JWT_Token(jwt.sign(data, JWT.secret, {expiresIn: duration?duration:JWT.duration}), duration?duration:JWT.duration);
//     }
// }
// export class JWT_Token{
//     token:string;
//     duration:string;
//     constructor(val:string, duration:string){
//         this.token = val;
//         this.duration = duration;
//     }
// }
