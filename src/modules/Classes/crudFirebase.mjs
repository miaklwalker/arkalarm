import {initializeApp} from "firebase/app";
import {
    getFirestore,
    collection,
    getDoc,
    getDocs,
    where,
    doc,
    query,
    addDoc,
    updateDoc,
    deleteDoc}
    from "firebase/firestore/lite";
import { getAuth, signInAnonymously } from "firebase/auth";

export class FirebaseCrud {
    constructor(collectionName) {
        this.config = {
            apiKey: "AIzaSyBnayFnmXsJfvVEu7X1oix70Zhs3lK5JwE",
            authDomain: "ark-alarm.firebaseapp.com",
            projectId: "ark-alarm",
            storageBucket: "ark-alarm.appspot.com",
            messagingSenderId: "82556541130",
            appId: "1:82556541130:web:1c7f9328e40ef7457dfc33",
            measurementId: "G-6D6P3WX13T"
        };
        this.db = undefined;
        this.collectionName = collectionName;
        this.id=null;
        this.data = null;
        this.init();
    }
    init(){
        let app =  initializeApp(this.config);
        this.db = getFirestore(app);
    }
    async getFromDatabase(name){
        const users = collection(this.db, this.collectionName);
        const queryConstraints = where("Discord Server", "==", name);
        const userSnapshot = await getDocs(query(users, queryConstraints));
        //if no user exists return null
        if(userSnapshot.empty){
            return null;
        }

        if(this.id === null){
       // this.id = userSnapshot.docs[0].id;
        }
        let data = userSnapshot.docs.map(doc => doc.data()).map(doc => doc.Configs)[0];
        let res = {data,name}
        this.data = res;
        return res
    }
    async AddToDatabase(name,data){
        const docRef = await addDoc(collection(this.db, this.collectionName), {"Discord Server": name, Configs: data});
        return docRef.id;
    }
    async UpdateDatabase(data){
        if(!this.id){
            await this.getDocFromDatabaseById(data["Discord Server"]);
        }
        console.log(this)
        const docRef = doc(this.db,this.collectionName,this.id);
        await updateDoc(docRef,data);
    }
    async getDocFromDatabaseById(id){
        const docRef = doc(this.db,this.collectionName,id);
        const docSnapshot = await getDoc(docRef);
        return docSnapshot.data();
    }
    async DeleteFromDatabase(){
        const docRef = doc(this.db,this.collectionName,this.id);
        await deleteDoc(docRef);
    }
}
export class KeyCrud extends FirebaseCrud{
    constructor(collectionName){
        super(collectionName);
    }
    async getFromDatabase(id){
        let docRef = doc(this.db,this.collectionName,id);
        let data = await getDoc(docRef);
        return data.data();
    }
    async AddToDatabase(data){
        const docRef = await addDoc(collection(this.db, this.collectionName), {"name": data});
        return docRef.id;
    }
}
