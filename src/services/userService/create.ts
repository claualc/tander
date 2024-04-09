import { COLLECTION_ID, userConverter } from ".";
import dbServices from "@firebaseServ/database"
import { CreateUserDTO } from "./DTO";
import photoServices from "@serv/photoServices";
import * as userSevices from "./index";
import matchServices from "@serv/matchServices";
import { User } from "@api/domain/User";

const execute = async (dto: CreateUserDTO) => {
    const {photos, ...userUncompleteDTO} = dto;

    const userRef = await dbServices.create(
        COLLECTION_ID, 
        {   ...userUncompleteDTO, 
            createdAt: new Date().toISOString()
        }, userConverter )
    
    console.log("..:: FirebaseService.create (user)", userRef.id)
    let photoChunkRefs: string[] = [];
    if (photos?.length) {
        const photoRefsPromise = photos.filter((v:any) =>  v != null)?.map(
            async (p) => await photoServices.createUserPhoto({
                photo: p, 
                userRef: userRef
            })
        )

        photoChunkRefs = await Promise.all(photoRefsPromise)
    }

    await userSevices.update({
        ...userUncompleteDTO,
        photoChunkRefs,
    }, userRef.id)

    const userCreated = await dbServices.getObjectByRef(userRef) as User

    await matchServices.createUserMatchFactories(userCreated)
    
    return userCreated
}

const CreateUserService = {execute}

export default CreateUserService;