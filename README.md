# Angular ACL

[![Build Status](https://img.shields.io/travis/mikemclin/angular-acl/master.svg?style=flat-square)](https://travis-ci.org/mikemclin/angular-acl)
[![Coverage Status](https://img.shields.io/coveralls/mikemclin/angular-acl/master.svg?style=flat-square)](https://coveralls.io/r/mikemclin/angular-acl?branch=master)

---

## About

Angular ACL _(Access Control List)_ is a service that allows you to protect/show content based on the current user's assigned role(s), and those role(s) permissions (abilities).  So, if the current user has a "moderator" role, and a moderator can "ban_users", then the current user can "ban_users".

Common uses include:

* Manipulate templates based on role/permissions
* Prevent routes that should not be viewable to user

### How secure is this?

A great analogy to ACL's in JavaScript would be form validation in JavaScript.  Just like form validation, ACL's in the browser can be tampered with.  However, just like form validation, ACL's are really useful and provide a better experience for the user and the developer.  Just remember, **any sensitive data or actions should require a server (or similar) as the final authority**.

##### Example Tampering Scenario

The current user has a role of "guest".  A guest is not able to "create_users".  However, this sneaky guest is clever enough to tamper with the system and give themselves that privilege. So, now that guest is at the "Create Users" page, and submits the form. The form data is sent to the server and the user is greeted with an "Access Denied: Unauthorized" message, because the server also checked to make sure that the user had the correct permissions.

Any sensitive data or actions should integrate a server check like this example.

---

## Basic Example

### Set Data

Setup the `AclService` in your app module's `run()` block.

```js
app.run(['AclService', function (AclService) {
  
  // Set the ACL data. Normally, you'd fetch this from an API or something.
  // The data should have the roles as the property names,
  // with arrays listing their permissions as their value.
  var aclData = {
    guest: ['login'],
    member: ['logout', 'view_content'],
    admin: ['logout', 'view_content', 'manage_content']
  }
  AclService.setAbilities(aclData);

  // Attach the member role to the current user
  AclService.attachRole('member');

}]);
```

### Protect a route

If the current user tries to go to the `/manage` route, they will be redirected because the current user is a `member`, and `manage_content` is not one of a member role's abilities.

However, when the user goes to `/content`, route will work as normal, since the user has permission.  If the user was not a `member`, but a `guest`, then they would not be able to see the `content` route either, based on the data we set above.

```js
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/manage', {
      resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('manage_content')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          }
        }]
      }
    });
    .when('/content', {
      resolve : {
        'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('view_content')){
            // Has proper permissions
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          }
        }]
      }
    });
}]);

app.run(['$rootScope', '$location', function ($rootScope, $location) {
  // If the route change failed due to our "Unauthorized" error, redirect them
  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
    if(rejection === 'Unauthorized'){
      $location.path('/');
    }
  })
}]);
```

### Manipulate a Template

The edit link in the template below will not show, because the current user is a `member`, and `manage_content` is not one of a member role's abilities.

###### Controller

```js
app.controller('DemoCtrl', ['$scope', 'AclService', function ($scope, AclService) {
  $scope.can = AclService.can;
  $scope.id = 22;
  $scope.title = 'My Demo Title';
}]);
```

###### Template

```html
<h1>{{ title }}</h1>
<a ng-href="edit/{{ id }}" ng-show="can('manage_content')">Edit</a>
```

---

## Install

Install with `bower`:

```shell
bower install angular-acl
```

Add a `<script>` to your `index.html`:

```html
<script src="/bower_components/angular-acl/angular-acl.js"></script>
```

And add `mm.acl` as a dependency for your app:

```javascript
angular.module('myApp', ['mm.acl']);
```

---

## Documentation

### Config

You can modify the configuration by extending the config object during the Angular configuration phase using the `config()` method on the `AclServiceProvider`.

```js
app.config(['AclServiceProvider', function (AclServiceProvider) {
  var myConfig = {
    storage: 'localStorage',
    storageKey: 'AppAcl'
  };
  AclServiceProvider.config(myConfig);
}]);
```

#### Config Options

| Property | Default | Description |
| -------- | ------- | ----------- |
| `storage` | `"sessionStorage"` | `"sessionStorage"`, `"localStorage"`, `false`. Where you want to persist your ACL data. If you would prefer not to use web storage, then you can pass a value of `false`, and data will be reset on next page refresh _(next time the Angular app has to bootstrap)_ |
| `storageKey` | `"AclService"` | The key that will be used when storing data in web storage |

### Public Methods

#### `AclService.resume()`

Restore data from web storage.

###### Returns

**boolean** - true if web storage existed, false if it didn't

###### Example Usage

```js
app.run(['AclService', function (AclService) {
  // Attempt to load from web storage
  if (!AclService.resume()) {
    // Web storage record did not exist, we'll have to build it from scratch
    
    // Get the user role, and add it to AclService
    var userRole = fetchUserRoleFromSomewhere();
    AclService.addRole(userRole);
    
    // Get ACL data, and add it to AclService
    var aclData = fetchAclFromSomewhere();
    AclService.setAbilities(aclData);
  }
}]);
```

You can also run `resume()` in the `config` phase, if you need the app to load the ACL data from web storage earlier in the app bootstrap process (e.g. before `$routeProvider` resolves the first route).

```js
app.config(['AclServiceProvider', function (AclServiceProvider) {
  AclServiceProvider.resume();
}]);
```

#### `AclService.attachRole(role)`

Attach a role to the current user. A user can have multiple roles.

###### Parameters

| Param | Type | Example | Details |
| ----- | ---- | ------- | ------- |
| `role` | string | `"admin"` | The role label |

#### `AclService.detachRole(role)`

Remove a role from the current user

###### Parameters

| Param | Type | Example | Details |
| ----- | ---- | ------- | ------- |
| `role` | string | `"admin"` | The role label |

#### `AclService.flushRoles()`

Remove all roles from current user

#### `AclService.getRoles()`

Get all of the roles attached to the user

###### Returns

**array**

#### `AclService.hasRole(role)`

Check if the current user has role(s) attached. If an array is given, all roles must be attached. To check if any roles in an array are attached see the `hasAnyRole()` method.

###### Parameters

| Param | Type | Example | Details |
| ----- | ---- | ------- | ------- |
| `role` | string/array | `"admin"` | The role label, or an array of role labels |

###### Returns

**boolean**

#### `AclService.hasAnyRole(roles)`

Check if the current user has any of the given roles attached. To check if all roles in an array are attached see the `hasRole()` method.

###### Parameters

| Param | Type | Example | Details |
| ----- | ---- | ------- | ------- |
| `roles` | array | `["admin","user"]` | Array of role labels |

###### Returns

**boolean**

#### `AclService.setAbilities(abilities)`

Set the abilities object (overwriting previous abilities).

###### Parameters

| Param | Type | Details |
| ----- | ---- | ------- |
| `abilities` | object | Each property on the abilities object should be a role. Each role should have a value of an array. The array should contain a list of all of the role's abilities. |

###### Example

```js
var abilities = {
  guest: ['login'],
  user: ['logout', 'view_content'],
  admin: ['logout', 'view_content', 'manage_content']
}
AclService.setAbilities(abilities);
```

#### `AclService.addAbility(role, ability)`

Add an ability to a role

###### Parameters

| Param | Type | Example | Details |
| ----- | ---- | ------- | ------- |
| `role` | string | `"admin"` | The role label |
| `ability` | string | `"create_users"` | The ability/permission label |

#### `AclService.can(ability)`

Does current user have permission to do the given ability?

###### Returns

**boolean**

###### Example

```js
// Setup some abilities
AclService.addAbility('moderator', 'ban_users');
AclService.addAbility('admin', 'create_users');

// Add moderator role to the current user
AclService.attachRole('moderator');

// Check if the current user has these permissions
AclService.can('ban_users'); // returns true
AclService.can('create_users'); // returns false
```

---

## License

The MIT License

Angular ACL
Copyright (c) 2016 Mike McLin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
