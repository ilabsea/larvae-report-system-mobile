describe('Clicking on the login button', function () {
  var email, password, loginButton;

  beforeEach(function () {
    browser.get('/#/login');
    email = element(by.model('user.email'));
    password = element(by.model('user.password'));
    loginButton = element(by.id('login-button'));
  });

  it('should validate the credentials for a successful login and display weekly number calendar view', function(){
    email.sendKeys('mouyleng+1@instedd.org');
    password.sendKeys('mouyleng123');

    loginButton.click().then(function(){
      expect(browser.getLocationAbsUrl()).toMatch('/weeks-calendar');

      var weeks = element.all(by.repeater('week in weeks'));
      expect(weeks.count()).toEqual(3);
    })
  })

  it('should display a popup for an unsuccessful login', function () {
    email.sendKeys('mouyleng@instedd.org');
    password.sendKeys('123');

    loginButton.click().then(function(){
      expect(browser.getLocationAbsUrl()).toMatch('/login');

      var popup = element(by.css('.popup-container.popup-showing.active'));
      expect(popup.isDisplayed()).toBeTruthy();
    })
  })

})
