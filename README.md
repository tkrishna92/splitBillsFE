# SplitBillsFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

SplitBills App

Front-end code : https://github.com/tkrishna92/splitBillsFE
Back-end code : https://github.com/tkrishna92/splitBillsBE
Application Link : http://webdevk.com/split

Local Testing directions :
	
	Pull the code from above mentioned links for front-end and back-end to a local location
	
	Using command line utility install npm and node and then install the required node_modules of front end and back end from respective local locations
	
	Go to the front end location from command line and use commands "ng serve"

	Go to the back end code location from command ling and use command "node index.js"

	from browser go to http://localhost:3000/
	

Project description

This application will help in splitting of amount between a groups of people. The application allows users to create groups and add expenses amongst the group people.  

Usage example:  if a group of five people go to a restaurant and one person pays the bill. The amount paid by that one person can be split among the five people. So if the bill was 100rupees, each one in the group will owe the payee 20rupees each. 

The app also shows the balances of the entire group as who owes who and how much. 

Application’s functionalities: 

User Management System : 

a.	Signup:	Users can sign up on the platform providing all details like FirstName, LastName, Email and Mobile number. Country code for mobile number (like 91 for India) should also be stored.

b.	Login :User can login using the credentials provided at signup.

c.	Forgot password: User can recover password using the link shown in the above login page. 

	If a user forgets password, the “forgot password” link can be used to access a page that will require security questions to verify the account. On providing correct information the user will be able to change the password using the link provided
	
	The link will be provided after entering security question and will be valid for changing the password for only 2 minutes

d.	Edit user profile information : Users can edit their profile information after logging into the account with email and password credentials

	To access this page go to the dropdown menu on the top right navigation bar with the user name and select “edit user” option


Expense Management System : 

a.	Group Management : 

	User should be able to create groups and add different people to it
	
	After user logs in to the account the dashboard has options to create groups on the left side column in the “groups” tab

	User first creates a group and then can add users to the group later. 

	When a user is added to a group they should be able to see that group name in dashboard

	User should also be able to access all the group expenses and details
	
	On clicking the group name in the “Groups” tab, user will be able to see all the details of the group and it expenses if any exists 

	People cannot exit from any group.

	After the user is added to the group, they will be able to see the group name under their “Groups” tab in their dashboard

b. 	Expense Management : 
	
	User should be able to go to the group and create an expense. Any user that is a member of the group can create an expense by clicking “Add Expenses” in the group view 
	
	notification will be sent to all the members of the group and if the user is currently navigating the same group, the expense will be updated in real time along with the notification 

	Expense has an amount field, name of the expense, people involved in the expense, who paid, when it was created, updated or deleted.

	On selecting any expense of the group all its details like along with its history if any exists will be visible 
	
	Expense details will be visible on selecting the expense from the expense view
	
	User can only add the people in the group for the expense. People from other groups cannot be added in  a group’s expense
	
	Everyone in the group should be able to add, edit or delete any expense. They should be able to edit the amount, who paid, people involved in the expense

	They can edit any expense by selecting the options icons that can be seen after selecting the expense

c.	Expense history : 
	
	A history of the expense is available which shows  information of editions or updates on the expense
	
	Each history entry of the expense should show who did that action, like following
		i.	Who created the expense
		ii.	Who updated the amount from someAmount to anotherAmount
		iii.	Who was removed from the expense

	
d.	Amount Pending :

	The amount due for each person of the group must is available. It also shows who owes whom along with how much they owe.
	
	Each user can see who owe the user how much from the options on the left side and whom the user owes how much as well 

	
e.	Realtime functionality : 

	Any creation of expense, update, edit and delete of the expense will be notified to the people involved in the expense through browser notifications 
