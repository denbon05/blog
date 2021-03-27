// @ts-check

export default class User {
  constructor(nickname, password) {
    this.guest = false;
    this.nickname = nickname;
    this.password = password;
  }

  isGuest() {
    return this.guest;
  }
  
  getName() {
    return this.nickname;
  }
  
  getPassword() {
    return this.password;
  }
};