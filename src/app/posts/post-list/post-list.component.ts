import { Component, OnInit, OnDestroy} from '@angular/core';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSubscription: Subscription;
  private authSatausSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 20, 50];
  userIsAthenticated = false;
  userId: string;

  constructor(public postService: PostService, private authService: AuthService) {  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSubscription = this.postService.getPostUpdateListener()
    .subscribe((data: {posts: Post[], postCount: number}) => {
      this.posts = data.posts;
      this.totalPosts = data.postCount;
      this.isLoading = false;
    });
    this.userIsAthenticated = this.authService.getAuthStatus();
    this.authSatausSub = this.authService.getAuthStatusListener().subscribe(isAuthed => {
      this.userIsAthenticated = isAuthed;
      this.userId = this.authService.getUserId();
    });
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe((res) => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
    }, error => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.authSatausSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.isLoading = false;
  }

}
