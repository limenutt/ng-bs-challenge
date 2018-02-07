# Challenge
## Frontend: Angular 5 and Bootstrap 4
### Running the application
`npm start` — (Angular CLI should be installed) runs the application
`npm test` — (Angular CLI should be installed) runs the application tests
## Backend: Node.JS, Express and Sequelize
### Running the application
#### Environment variables
* MYSQL_PORT_3306_TCP_ADDR — MySQL host, default is localhost
* MYSQL_PORT_3306_TCP_PORT — MySQL port, default is 3306
* MYSQL_DB — MySQL database name
* MYSQL_DB_USER — MySQL database user
* MYSQL_DB_PASSWORD — MySQL database password
* LOG_LEVEL — Log level: verbose, info, warn or error
* JWT_SECRET — Secret that is used to issue JWT
* JWT_EXPIRES_IN — JWT lifetime, in milliseconds
* SERVER_PORT — port on which the server is running, default is 3031

#### During development, locally
`npm run start-w` — compiles the application and runs it. If changes are detected, performs incremental compilation and restarts the application.
`npm run test-w` — compiles the application and runs the tests. If changes are detected, performs incremental compilation and reruns the tests.
#### In container
(TBD) sh scripts/run-local-docker.sh
