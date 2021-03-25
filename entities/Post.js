// @ts-check

export default class Post {
  static id = 0;

  constructor(title, body) {
    Post.id += 1;
    this.title = title;
    this.body = body;
    this.id = Post.id;
  }
}
