import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Comment } from '../models/comment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor( private db : AngularFirestore) { }

  saveComment(comment: Comment) {
    const commentData = JSON.parse(JSON.stringify(comment));
    return this.db.collection("comments").add(commentData);
  }

  deleteSingleComment(commentId: string) {
    return this.db.doc('comments/' +commentId).delete();
  }

  getAllCommentsForBlog(blogId: string): Observable<Comment[]> {
      const comments = this.db.collection<Comment>('comments', ref => 
        ref.where('blogId', '==', blogId).orderBy('commentDate', 'desc')).snapshotChanges().pipe(map(action => {
          return action.map( c => ({
              commentId: c.payload.doc.id,
              ...c.payload.doc.data()
          }));
        }));
        return comments;
  }

  deleteAllCommentForBlog(blogId: string) {
    const commentsToDelete = this.db.collection('comments', ref => ref.where('blogId', '==', blogId)).snapshotChanges();
    commentsToDelete.forEach(commentList => {
      commentList.forEach(comment => {
        this.db.doc('comments/'+comment.payload.doc.id).delete();
      });
    });
  }
}
