# Shatab (Graduation Project )
 
It's an application to help customers easily buy constructing products such as (paintings, wood, glass, etc..) and connect them with a special constructor to make use of the products, the user will find a product provided with different companies to meet all requirements 

## Live Demo

 To see the app in action, go to https://powerful-temple-40171.herokuapp.com/
 
* ## Features
   * Authentication:
     * User login with username and password
     * Admin login with admin code
   
   * Authorization
      * only admins can add or delete elements in the website

   * shopping room
     * this room provides different categories (paint, glass, ceramic ...etc)
     * Everey categories have different companies and each company provides many products
     
  * shopping cart
     * the user can add as many as items in the shopping cart
     * easily remove unwanted items
     * ability to add ratings and comments
     
  * constructor help
     * Providing many constructors with different ratings and prices
     * ability to add ratings and comments
     * send request to constructor and get the response via email
  
  * Manage warehouse posts with basic functionalities:
    * flexabilty to add new categories, companies and products
    * Search existing company, categories or products with single or binded queries
    * sending email address to the user after completing the process

  * Manage user account with basic functionalities:
    * Profile page setup with sign-up
    * show the newly added orders to the user profile
    
  * Flash messages responding to users' interaction with the app

  * Responsive web design

* ## Stack
   * NodeJS & NPM
   * MongoDB
   
* ## Related Modules
   * express — web application framework for node
   * Bootstrap — CSS Framework
   * passport — Simple, authentication for Node.js.
   * mongoose — MongoDB object modeling tool designed to work in an asynchronous environment
   * Nodemailer — package to allow sending E-mail via node
