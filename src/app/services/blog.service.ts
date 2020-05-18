import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from  'rxjs/operators';   
import { Observable } from  'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private db: AngularFirestore) { }

  createPost(post: Post) {
    const postData = JSON.parse(JSON.stringify(post));
    return this.db.collection('blog').add(postData);
  }

  getAllPosts(): Observable<Post[]> {
    const blog = this.db.collection<Post>('blog', ref => ref.orderBy('createdDate', 'desc'))
                  .snapshotChanges().pipe(
                    map(actions => {
                      return actions.map(
                        c => ({
                          postId: c.payload.doc.id,
                          ...c.payload.doc.data()
                        })
                      );
                    })
                  );
                  return blog;
  }

  getPostbyId(id: string): Observable<Post> {
    const blogDetails = this.db.doc<Post>('blog/' +id).valueChanges();
    return blogDetails;
  }

  deletePost(postId: string) {
    return this.db.doc('blog/' +postId).delete();
  }

  updatePost(postId: string, post: Post) {
    const putData = JSON.parse(JSON.stringify(post));
    return this.db.doc('blog/' +postId).update(putData);
  }
}
