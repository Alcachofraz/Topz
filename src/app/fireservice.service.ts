import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import * as firebase from 'firebase/app';
import { Top } from './top';
import { TopItem } from './top-item';
import { getLocaleDateFormat, NumberFormatStyle } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FireserviceService {
  private snapshotChangesSubscription: any;
  constructor(
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
  ) { }

  getUser() {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).snapshotChanges();
    });
  }

  createUser(uid: string, email: string, username: string) {
    return this.firestore.collection('users').doc(uid).set({ email: email, uid: uid, username: username });
  }

  deleteItems(uid, topId) {
    return this.firestore.firestore.collection('users').doc(uid).collection('tops').doc(topId).collection('items').get().then((snapshot) => {
      return snapshot.docs.forEach((doc) => doc.ref.delete());
    })
  }

  getTop(id: string) {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(id).snapshotChanges();
    });
  }

  getItems(id: string) {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(id).collection('items').snapshotChanges();
    });
  }

  getTops() {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).collection('tops').snapshotChanges();
    });
  }

  createTop(top: Top) {
    return this.auth.currentUser.then((currentUser) => {
      top.author = currentUser.email;
      top.date = new Date().toLocaleString('pt');
      return this.firestore.collection('users').doc(currentUser.uid).collection('tops').add(top);
    });
  }

  createItems(id: string, items: TopItem[]) {
    var batch = this.firestore.firestore.batch();
    return this.auth.currentUser.then((currentUser) => {
      items.forEach((item) => {
        const batchRef = this.firestore.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(id).collection('items').doc();
        batch.set(batchRef, item);
      });
      return batch.commit();
    });
  }

  updateTop(topId: any, top: Top) {
    return this.auth.currentUser.then((currentUser) => {
      this.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(topId).set(top);
      //this.af.doc('tasks/' + TaskID).update(t);
    });
  }

  deleteTop(topId: any) {
    console.log(topId);
    return this.auth.currentUser.then((currentUser) => {
      console.log(currentUser.uid);
      return this.deleteItems(currentUser.uid, topId).then((response) => {
        return this.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(topId).delete();
      });
    })
  }
  unsubscribeOnLogOut() {
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }
}
