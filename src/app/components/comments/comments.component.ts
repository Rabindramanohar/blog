import { OnInit, Input, Component, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommentService } from 'src/app/services/comment.service';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AppUser } from 'src/app/models/appuser';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  providers: [DatePipe]
})
export class CommentsComponent implements OnInit,OnDestroy {

  @Input() blogId: string;

  appUser: AppUser;

  private unsubscribe$ = new Subject<void>();
  public comments = new Comment();
  commentList: Comment[] = [];

  constructor( private datePipe: DatePipe,
               private commentService: CommentService,
               private authService: AuthService,
               private snackBarService: SnackbarService) { }

  ngOnInit(): void {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
    this.getAllComments();
  }

  getAllComments() {
    this.commentService.getAllCommentsForBlog(this.blogId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.commentList = result;
    });
  }

  onCommentDetail(commentForm: any) {
    this.comments.commentDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm:ss');
    this.comments.blogId = this.blogId;
    this.commentService.saveComment(this.comments).then(
      commentForm.resetForm()
    );
  }

  deleteComment(commentId: string) {
    if(confirm('Do you want delete this comment!!')) {
      this.commentService.deleteSingleComment(commentId).then(
        () => {
          this.snackBarService.showSnackBar('Comment deleted successfully!!');
        }
      );
    }
  }

  login() {
    this.authService.login();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
