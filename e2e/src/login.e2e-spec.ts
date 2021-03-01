import { LoginPage } from './login.po';

declare var Chance: any;

describe('Login', () => {
  let page: LoginPage;
  const Chance = require('chance');
  const chance = new Chance();
  
  beforeEach(async() => {
    page = new LoginPage();
    await page.navigateTo();
  });
  
  afterEach(function() {
    page.removeAuthTokens();
  });

  it('Should authenticate a user with username and password', async() => {
    const userNameField = page.getUserNameElement();
    const passwordField = page.getPasswordElement();
    const submitButton =  page.getSubmitButtonElement();

    userNameField.sendKeys(chance.email());
    passwordField.sendKeys(chance.string());
    submitButton.click();

    expect(page.getTitle()).toEqual('Admin');
  });

});
