## Get Started

-   composer install
-   npm install
-   sudo cp .env.example .env
-   php artisan key:generate
-   php artisan jwt:secret
-   php artisan migrate:fresh --seed

## Feature

-   CRUD API GENERATOR
-   ROUTE LIST
-   Faker Factory
### CREATE NEW TABLE
-   `php artisan make:migration "create_{table_names}_table"`, table_names is the table you want to create, 
### CRUD API GENERATOR
-   `php artisan generate:crud {name}`, The name should be like the table of migration you made, singular and used PascalCase, ex:NewTransaction
-   edit the model where its generated. fill the fillable column and the relation table.
-   edit the controller validation if u need it.
 
### ROUTE LIST

-   route can be see on localhost:8000/routes

### FAKER FACTORY

-   make seeder using this command `php artisan make:seeder {name}`
-   make factory file on this path `database/Factory/{FactoryName}`

### RUN APPS

-   php artisan serve
-   npm run watch

### CLEARING CONFIG, ROUTES, CACHE

-   php artisan optimize
-   php artisan config:clear
-   php artisan route:clear
