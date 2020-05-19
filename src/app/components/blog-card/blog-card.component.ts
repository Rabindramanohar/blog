import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent implements OnInit, OnDestroy {

  config: any;
  pageSizeOptions = [];

  constructor(private blogService: BlogService,
              private snackBar: SnackbarService,
              private route: ActivatedRoute) { 
                this.pageSizeOptions = [2, 4, 6];
                const pageSize = localStorage.getItem('pageSize');
                this.config = {
                  currentPage: 1,
                  itemsPerPage: pageSize ? +pageSize : this.pageSizeOptions[0]
                };
               }

  blogPost: Post[] = [];
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.getBlogPosts();
    this.route.params.subscribe( param => {
      this.config.currentPage = +param['pagenum'];
      this.getBlogPosts();
    })
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
        this.snackBar.showSnackBar('Post deleted Successfully!!');
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
