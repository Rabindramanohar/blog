import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from 'src/app/models/appuser';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent implements OnInit, OnDestroy {

  config: any;
  pageSizeOptions = [];
  blogPost: Post[] = [];
  private unsubscribe$ = new Subject<void>();
  appUser: AppUser;


  constructor(private blogService: BlogService,
              private snackBar: SnackbarService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private commentService: CommentService) { 
                this.pageSizeOptions = [2, 4, 6];
                const pageSize = localStorage.getItem('pageSize');
                this.config = {
                  currentPage: 1,
                  itemsPerPage: pageSize ? +pageSize : this.pageSizeOptions[0]
                };
              }

              ngOnInit() {

                this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
            
                this.route.params.subscribe(
                  params => {
                    this.config.currentPage = +params['pagenum'];
                    this.getBlogPosts();
                  }
                );
              }

  getBlogPosts() {
    this.blogService.getAllPosts().pipe(
                    takeUntil(this.unsubscribe$))
                    .subscribe(result => {
                      this.blogPost = result;
                    });
  }

  delete(postId: string) {
    if(confirm('Are you sure.')) {
      this.blogService.deletePost(postId).then(()=> {
        this.commentService.deleteAllCommentForBlog(postId);
        this.snackBar.showSnackBar('Post deleted Successfully!!');
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
