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
  constructor(
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
  ) { }

  streamUser() {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).snapshotChanges();
    });
  }

  streamUserByUid(uid: string) {
    return this.firestore.collection('users').doc(uid).snapshotChanges();
  }

  getUser() {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.firestore.collection('users').doc(currentUser.uid).get();
    });
  }

  createUser(uid: string, email: string, username: string) {
    return this.firestore.collection('users').doc(uid).set({
      email: email, uid: uid, username: username, photoUrl: 'https://picsum.photos/800'
    });
  }

  deleteItems(uid, topId) {
    return this.firestore.firestore.collection('users').doc(uid).collection('tops').doc(topId).collection('items').get().then((snapshot) => {
      return snapshot.docs.forEach((doc) => doc.ref.delete());
    });
  }

  getTimeline(uid: string) {
    return this.firestore.collectionGroup('tops').snapshotChanges();
  }

  getTop(id: string) {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(id).snapshotChanges();
    });
  }

  streamItems(id: string) {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(id).collection('items').snapshotChanges();
    });
  }

  getItems(id: string) {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(id).collection('items').get();
    });
  }

  saveItems(uid: string, topId: string, items) {
    var batch = this.firestore.firestore.batch();
    items.forEach((item) => {
      const batchRef = this.firestore.firestore.collection('users').doc(uid).collection('tops').doc(topId).collection('items').doc(item.$key);
      batch.set(batchRef, item);
    });
    return batch.commit();
  }

  getTops() {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).collection('tops').snapshotChanges();
    });
  }

  createTop(top: Top) {
    return this.getUser().then((user) => {
      top.author = user.id;
      top.date = new Date().toLocaleString('pt');
      top.authorName = user.data()['username'];
      return this.firestore.collection('users').doc(user.id).collection('tops').add(top);
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
    return;
  }
}
