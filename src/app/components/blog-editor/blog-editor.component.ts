import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Post } from 'src/app/models/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss'],
  providers: [DatePipe]
})
export class BlogEditorComponent implements OnInit {

  public Editor = ClassicEditor;
  ckeConfig: any;
  postData = new Post;
  formTitle = 'Add';
  postId = '';

  constructor(private route: ActivatedRoute,
              private datePipe: DatePipe,
              private blogService: BlogService,
              private router: Router) { }

  setEditorConfig() {
    this.ckeConfig = {
      removePlugins: ['ImageUpload', 'MediaEmbed'],
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'heading1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'heading2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'heading3', class: 'ck-heading_heading3' },
          { model: 'heading4', view: 'h4', title: 'heading4', class: 'ck-heading_heading4' },
          { model: 'heading5', view: 'h5', title: 'heading5', class: 'ck-heading_heading5' },
          { model: 'heading6', view: 'h6', title: 'heading6', class: 'ck-heading_heading6' },
          { model: 'Formatted', view: 'pre', title: 'Formatted' }
        ]
      }
    };
  }

  saveBlogPost() {
    this.postData.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm');
    this.blogService.createPost(this.postData).then(()=> {
      this.router.navigate(['/']);
    })
  }

  cancel() {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.setEditorConfig();
  }

}
