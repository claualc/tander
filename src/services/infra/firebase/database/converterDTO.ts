import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export interface converter<T> {
    toFirestore(item: T): Object,
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): any
}