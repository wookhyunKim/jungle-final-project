const { MongoClient } = require("mongodb");
const dbconfig = require("../config/dbconfig.json");

const url = `mongodb+srv://${dbconfig.id}:${dbconfig.password}@cluster0.jmw2t.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(url, {
    maxPoolSize: 10,
});
const RoomDao = {
    createRoom: async (roomCode) => {
        const newRoom = {
            room: {
                code: roomCode,
                participants: {
                    participant: {
                        nickname: "GOONGYE",
                        words: {
                            word: "아니",
                        },
                        missions: {},
                        secret: {},
                    },
                },
                photos: {},
            },
        };
        await client.connect();
        let result;
        try {
            const db = client.db("database");
            const rooms = db.collection("rooms");
            result = await rooms.insertOne(newRoom);
        } catch (error) {
            throw error;
        }

        // client.close();
        return result;
    },

    getAllRooms: async () => {
        let allRooms;
        try {
            await client.connect();
            const db = client.db("database");
            const rooms = db.collection("rooms");

            // roomId에 따라 필터링
            allRooms = await rooms.find().toArray();
        } catch (error) {
            throw error;
        } finally {
            // client.close(); // 클라이언트 연결 종료
        }

        return allRooms;
    },
    getOneRoom: async (roomCode) => {
        let room;
        try {
            await client.connect();
            const db = client.db("database");
            const rooms = db.collection("rooms");

            // roomId에 따라 필터링
            room = await rooms.findOne({ "room.code": roomCode });
        } catch (error) {
            throw error;
        } finally {
            // client.close(); // 클라이언트 연결 종료
        }

        return room;
    },
    deleteRoom: async (roomCode) => {
        try {
            await client.connect();
            const db = client.db("database");
            const rooms = db.collection("rooms");
            // roomId에 따라 필터링
            result = await rooms.deleteOne({ "room.code": roomCode });
        } catch (error) {
            throw error;
        } finally {
            // client.close(); // 클라이언트 연결 종료
        }

        return result;
    },
    patchRoom: async (roomCode) => {
        try {
            await client.connect();
            const db = client.db("database");
            const rooms = db.collection("rooms");
            // roomId에 따라 필터링
            result = await rooms.updateOne(
                { "room.code": roomCode },
                { $set: { "room.code": "123123" } }
            );
        } catch (error) {
            throw error;
        } finally {
            // client.close(); // 클라이언트 연결 종료
        }

        return result;
    },
};

// 프로세스 종료 시 클라이언트 연결 종료
process.on("SIGINT", async () => {
    await client.close();
    console.log("MongoDB connection closed");
    process.exit(0);
});

module.exports = RoomDao;
