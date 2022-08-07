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
import { getAuth, signInWithCustomToken } from "firebase/auth";
import generateToken from "../functions/generateToken.js"


let app =  initializeApp({
    apiKey: "AIzaSyBnayFnmXsJfvVEu7X1oix70Zhs3lK5JwE",
    authDomain: "ark-alarm.firebaseapp.com",
    projectId: "ark-alarm",
    storageBucket: "ark-alarm.appspot.com",
    messagingSenderId: "82556541130",
    appId: "1:82556541130:web:1c7f9328e40ef7457dfc33",
    measurementId: "G-6D6P3WX13T"
});
async function signIn(){
    let token = await generateToken("CRUD USER");
    let auth = getAuth(app);
    await signInWithCustomToken(auth,token);
    console.log("Signed in");
}
await signIn();


export class FirebaseCrud {
    constructor(collectionName) {
        this.db = undefined;
        this.collectionName = collectionName;
        this.id=null;
        this.data = null;
        this.init();
    }
    init(){
        this.db = getFirestore(app);
    }
    async getFromDatabase(name){
        const users = collection(this.db, this.collectionName);
        const queryConstraints = where("Discord Server", "==", name);
        const userSnapshot = await getDocs(query(users, queryConstraints));
        if(userSnapshot.empty){
            return null;
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
    async updateDatabase(data){
        if(!this.id){
            await this.getDocFromDatabaseById(data["Discord Server"]);
        }
        const docRef = doc(this.db,this.collectionName,this.id);
        await updateDoc(docRef,data);
    }
    async getDocFromDatabaseById(id){
        const docRef = doc(this.db,this.collectionName,id);
        console.log(docRef)
        const docSnapshot = await getDoc(docRef);
        return docSnapshot.data();
    }
    async deleteFromDatabase(id){
        const docRef = doc(this.db,this.collectionName,id);
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
    async AddToDatabase(data,token=""){
        let temp = {"name":data};
        if(token!==""){
            temp["token"] = token;
        }
        const docRef = await addDoc(collection(this.db, this.collectionName), temp);
        return docRef.id;
    }
}



