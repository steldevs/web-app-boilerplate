# React Typescript & .NET Core 7 Web App Boilerplate 
Hi! I have created this **template** to help myself to get new projects up and running quicker and also to make my first open-source contribution to the dev community. Some tweaks are needed to make this production-ready so consider it for demo only purposes.

This repository is **docker friendly**.

I will do my best to keep updating/extending the repo whenever possible.

![enter image description here](https://stel.dev/img/webapp-boilerplate-demo.PNG)
## Scope

Since this is a template, it is limited in terms of functionality. At the moment it does the following:

 - Registers and logs in a user
 - Authenticates a user between the frontend and the backend with JWT tokens
 - Uses http-only cookies for user authentication/persistance
 - Sample of CRUD operations
 - React routing 
 - MUI user interface with Theme provider
 - RHF with validation
 - Uses redux and local storage as example
 - RTL and MSTest examples
 
 React frontend has [redux-toolkit](https://www.npmjs.com/package/@reduxjs/toolkit) and [react-hook-form](https://www.npmjs.com/package/react-hook-form) integrated. Testing coverage is for demo purposes and has been done via [react-testing-library](https://www.npmjs.com/package/@testing-library/react) and [Moq](https://www.nuget.org/packages/Moq) / [MSTest Framework](https://www.nuget.org/packages/MSTest.TestFramework).

Unit of work and repository patterns have been used in conjuction for the .NET core app, for demo purposes.

The repository provides a consistent interface for the application to interact with the data source, while the unit of work manages the transactional operations required to maintain data consistency.

## Running the app
### Docker profiles
There are two docker profiles:

 1. dev 
This profile will only run a postgres instance, the backend and the frontend must be run separately.
 2. docker
This profile will run all the required projects.

When running the app for the first time it is necessary to migrate the postgres db from the .Net app. 
To do that navigate to the root directory and run `docker compose --profile dev up`. This will spin the postgres instance.

Then **migrate** the database by either using the .NET Core CLI or Visual studio.

For the CLI method run the following command from the root directory.
`dotnet ef --startup-project ./WebAppBoilerplate database update`

For the Visual Studio on windows use the Package Manager console, set the WebAppBoilerplate as the default projcet and run the following  command:
`Update-Database`

The migration files are already generated and part of this repo. If you need to re-generate or update them you should run the `Add-Migration` command from the PM console or the `dotnet ef --startup-project ../WebAppBoilerplate migrations add` command from the .NET CLI .

### Running for demo
After you've migrated the database kill the previous docker session and run:
`docker compose --profile docker up`
This should run the database, frontend and backend. The frontend will be accessible at: `localhost:8080`.

Register a user and then use its credentials to login.

### Running for development
After you've migrated the database navigate to the react app's directory and run `npm install` to install the required packages.
Then open the .net solution file in Visual Studio and build & run from there. The frontend will be accessible at `localhost:3000` when running in dev mode.