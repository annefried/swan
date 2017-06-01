/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('SWAN', function() {

  beforeEach(function() {
    browser.get('');
    if (browser.getCurrentUrl() === 'http://localhost:8080/swan/#/dashboard') {
        var logoutButton = element(by.id('logoutButton'));
        logoutButton.click();
    }
  });

  it('should redirect to the the signin page if not logged in', function() {
    browser.get('');
    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/swan/signin.html');
  });

  it('should allow an admin to log in', function() {
    browser.get('http://localhost:8080/swan/signin.html');

    var userName = element(by.id('inputEmail'));
    var password = element(by.id('inputPassword'));
    var signinButton = element(by.id('signinButton'));

    userName.sendKeys('admin@discanno.de');
    password.sendKeys('secret');
	signinButton.click();
	  
	expect(browser.getCurrentUrl()).toBe('http://localhost:8080/swan/#/dashboard');
	expect(browser.executeScript("return window.sessionStorage.role")).toEqual("admin");
  });
});

