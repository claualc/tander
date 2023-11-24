import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export interface converter<T> {
    toFirestore(item: T): DocumentData,
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): any
}