import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import * as firebase from 'firebase/app';
import { Top } from './top';

@Injectable({
  providedIn: 'root'
})
export class FireserviceService {
  private snapshotChangesSubscription: any;
  constructor(
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
  ) { }

  getTops() {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).collection('tops').snapshotChanges();
    });
  }

  createTop(top: Top) {
    return this.auth.currentUser.then((currentUser) => {
      return this.firestore.collection('users').doc(currentUser.uid).collection('tops').add(top);
    });
  }

  updateTop(topId: any, top: Top) {
    return this.auth.currentUser.then((currentUser) => {
      this.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(topId).set(top);
      //this.af.doc('tasks/' + TaskID).update(t);
    });
  }

  deleteTop(topId: any) {
    return this.auth.currentUser.then((currentUser) => {
      this.firestore.collection('users').doc(currentUser.uid).collection('tops').doc(
        topId).delete();
      //this.af.doc('tasks/' + TaskID).delete();
    })
  }
  unsubscribeOnLogOut() {
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }
}
