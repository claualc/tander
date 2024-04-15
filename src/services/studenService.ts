import universityDic from "@dict/university";
import courseDic from "@dict/course";
import { Course, Univeristy } from "@domain/University";

const getUniversityById = (id: string) => {
    const dto = universityDic[id];
    return new Univeristy(
        dto.name, dto.shortName, id
    );
}

const getCourseById = (id: number) => {
    const dto =  courseDic[id];
    return new Course(
        dto.name, id
    );
}

const listAllUniversity = () => {
    return Object.keys(universityDic).map(getUniversityById)
}

const listAllCourse = () => {
    return courseDic.map((c, id) => new Course(
        c.name, id
    ))
}

const studentService = {
    listAllCourse,
    listAllUniversity,
    getCourseById,
    getUniversityById
}

export default studentService;