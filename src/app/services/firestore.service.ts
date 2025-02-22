import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);
  private ngZone: NgZone = inject(NgZone);

  constructor() {}

  async getBusinessCard(id: string): Promise<any> {
    try {
      const docRef = doc(this.firestore, `businessCards/${id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.ngZone.run(() => docSnap.data());  
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }

  async saveBusinessCard(id: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.firestore, `businessCards/${id}`);
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error saving document:', error);
    }
  }
}
