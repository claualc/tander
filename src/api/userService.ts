import firebase from "firebase/app";

import { services } from "@serv/firebase";

interface userServiceI {
    listAll(): void;
}

const COLLECTION_ID = "user"; //collection

const userService = {
    listAll: async () => {
        return await services?.dbService.listAll(COLLECTION_ID);
    }
}

export default userService;