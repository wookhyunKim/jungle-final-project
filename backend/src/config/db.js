// 데이터베이스 연결 설정
const MongoClient = require("mongodb").MongoClient;
const dbconfig = require("./dbconfig.json");

const url = `mongodb+srv://${dbconfig.id}:${dbconfig.password}@willing-db.ppf64bo.mongodb.net/room?retryWrites=true&w=majority`;

// 프로미스 기반 사용을 위해 pool.promise()를 반환
module.exports = pool.promise();
