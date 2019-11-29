import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{
      posts: any;
      totalPosts: number;
      message: string;
    }>
    (BACKEND_URL + queryParams)
    .pipe(map(records => {
      return {posts: records.posts, totalPosts: records.totalPosts};
    }))
    .subscribe(mappedData => {
      this.posts = mappedData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: mappedData.totalPosts
      });
    });
  }

  getPost(id: string) {
    return this.http.get<{id: string, title: string,
      content: string, imagePath: string, creator: string}>
      (BACKEND_URL + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{
      post: Post;
      message: string;
    }>
    (BACKEND_URL, postData).subscribe((res) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

  updatePost(postId: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: postId, title, content, imagePath: image, creator: null
      };
    }
    this.http.put<{
      imagePath: string;
      message: string;
    }>
    (BACKEND_URL + postId, postData)
    .subscribe(res => {
      this.router.navigate(['/']);
    });
  }
}
