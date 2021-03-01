import { browser, by, element } from 'protractor';

export class AdminPage {
  async navigateTo() {
    return await browser.get('/home');
  }

  getTitle() {
    return element(by.css('app-root h2')).getText();
  }
  
  getAdminMenuElement() {
    return element(by.linkText('Admin'));
  }
}
