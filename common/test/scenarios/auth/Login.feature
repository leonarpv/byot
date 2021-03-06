Feature: Login user
  Successful and unsuccessful login

  Scenario Outline: logging in
    When user visits login form
    And user enters username <username>
    And user enters password for login<password>
    And user tries to login
    Then login should be <state>
    Examples:
      | username | password                              | state        |
      | demo-1   | {env.APP_DEMO_USER_PASSWORD}          | successful   |
      | demo-2   | {env.APP_DEMO_USER_PASSWORD}          | successful   |
      | demo-1   | something-that'll probably won't work | unsuccessful |
      | demo-2   | An0therDummyPAss                      | unsuccessful |
