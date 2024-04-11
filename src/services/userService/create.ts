import { COLLECTION_ID, userConverter } from ".";
import dbServices from "@firebaseServ/database"
import { CreateUserDTO } from "./DTO";
import photoServices from "@serv/photoServices";
import * as userSevices from "./index";
import matchServices from "@serv/matchServices";
import { User } from "@api/domain/User";
import authService from "@serv/authService";

enum createUserDTOErrors {
    ERROR="error"
}

const execute = async (dto: CreateUserDTO, password: string) => {
    const {photos, ...userUncompleteDTO} = dto;

    try {
        const auth = await authService.signUp( 
            userUncompleteDTO.phoneNumber,
            password
        );

        if (auth?.user?.uid) {
            const userRef = await dbServices.create(
                COLLECTION_ID, 
                {   ...userUncompleteDTO, 
                    id: auth?.user.uid,
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
    } catch(e) {
        console.log("..:: CreateUserDTO.execute")
        console.log(e)
        throw new Error(createUserDTOErrors.ERROR)
    }
}

const CreateUserService = {execute}

export default CreateUserService;