import { Injectable } from '@angular/core';
import { collectionData, docSnapshots, Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  createContact(contact: any){
    //Agregar un contacto a la coleccion
    const document = doc(collection(this.firestore, 'contacts'));
    return setDoc(document, contact);
  }

  //Traer todos los contactos almacenados en la coleccion
  getContacts(): Observable<any[]> {
    const contactsCollection = collection(this.firestore, 'contacts');
    return collectionData(contactsCollection, { idField: 'id'})
    .pipe(map(contacts => contacts as any[]))
  }

  //Traer un contacto en especifico
  getContactById(id: string): Observable<any> {
    const document = doc(this.firestore, `contacts/${id}`);
    return docSnapshots(document)
    .pipe(map(doc => {
      const id = doc.id;
      const data = doc.data();
      return { id, ...data } as any;
    }));
  }

  //Editar un contacto en especifico
  editContact(contact: any) {
    const document = doc(this.firestore, 'contacts', contact?.id);
    const { id, ...data } = contact;
    return setDoc(document, data);
  }

  //Elimina/remueve un contacto en especifico
  removeContact(id: string) {
    const document = doc(this.firestore, 'contacts', id);
    return deleteDoc(document);
  }

}

