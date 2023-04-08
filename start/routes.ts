/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//User
Route.group(() => {
  Route.get('', 'UsersController.index')
  Route.post('login', 'UsersController.login')
  Route.post('level', 'UsersController.level')
    .middleware(['userAdmin'])
  Route.post('register_admin', 'UsersController.register_admin')
    .middleware(['userAdmin', 'userName'])
  Route.post('register', 'UsersController.register')
    .middleware(['userName'])
  Route.delete('delete/:id', 'UsersController.delete')
    .middleware(['userAdmin'])
}).prefix('user')

//Blog
Route.group(() => {
  Route.get('', 'BlogsController.index')
  Route.post('create', 'BlogsController.createDraft')
    .middleware(['userWho'])
  Route.get('readActive', 'BlogsController.readActive')
  Route.get('readDraft/:id', 'BlogsController.readDraftByUser')
    .middleware(['userWho'])
  // Route.get('readDraft', 'BlogsController.readDraft')
  //   .middleware(['userWho'])
  Route.put('updateDraft/:id', "BlogsController.updateDraftByUser")
    .middleware(['userWho'])
  Route.delete('deleteDraft/:id', "BlogsController.deleteDraftByUser")
    .middleware(['userWho'])
}).prefix('blog')

//Role
Route.group(() => {
  Route.post('', 'RolesController.store')

}).prefix('role')


Route.post('up', 'BlogsController.uploadpicture')
