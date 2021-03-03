import { browser, by, element } from 'protractor';

export class LoginPage {

  async navigateTo() {
    return await browser.get('/login');
  }

  removeAuthToken() {
    browser.executeScript("window.localStorage.clear();");
  }

  getAuthToken() {
    browser.executeScript("window.localStorage.getItem('auth_token');");
  }

  getTitle() {
    return element(by.css('app-root h2')).getText();
  }

  getUserNameElement() {
    return element(by.id('username'));
  }

  getPasswordElement() {
    return element(by.id('password'));
  }

  getSubmitButtonElement() {
    return element(by.css("button[type = 'submit']"));
  }
}
