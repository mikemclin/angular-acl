'use strict';

var NG_HIDE_CLASS = 'ng-hide';

angular.module('mm.acl', []);

angular.module('mm.acl').provider('AclService', [
  function () {

    /**
     * Polyfill for IE8
     *
     * http://stackoverflow.com/a/1181586
     */
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (needle) {
        var l = this.length;
        for (; l--;) {
          if (this[l] === needle) {
            return l;
          }
        }
        return -1;
      };
    }

    var config = {
      storage: 'sessionStorage',
      storageKey: 'AclService'
    };

    var data = {
      roles: [],
      abilities: {}
    };

    /**
     * Does the given role have abilities granted to it?
     *
     * @param role
     * @returns {boolean}
     */
    var roleHasAbilities = function (role) {
      return (typeof data.abilities[role] === 'object');
    };

    /**
     * Retrieve the abilities array for the given role
     *
     * @param role
     * @returns {Array}
     */
    var getRoleAbilities = function (role) {
      return (roleHasAbilities(role)) ? data.abilities[role] : [];
    };

    /**
     * Persist data to storage based on config
     */
    var save = function () {
      // { case1: value1 }[case1] # => value1
      let storageType = {
        sessionStorage: 'sessionStorage',
        localStorage  : 'localStorage'
      }[config.storage];
      
      storageType && saveToStorage(storageType);
      }
    };

    var unset = function () {
      switch (config.storage) {
        case 'sessionStorage':
          unsetFromStorage('sessionStorage');
          break;
        case 'localStorage':
          unsetFromStorage('localStorage');
          break;
        default:
          // Don't save
          return;
      }
    };

    /**
     * Persist data to web storage
     */
    var saveToStorage = function (storagetype) {
      window[storagetype].setItem(config.storageKey, JSON.stringify(data));
    };

    /**
     * Unset data from web storage
     */
    var unsetFromStorage = function (storagetype) {
      window[storagetype].removeItem(config.storageKey);
    };

    /**
     * Retrieve data from web storage
     */
    var fetchFromStorage = function (storagetype) {
      var data = window[storagetype].getItem(config.storageKey);
      return (data) ? JSON.parse(data) : false;
    };

    var AclService = {};
    AclService.resume = resume;

    /* start-test-block */

    // Add debug annotations for unit testing private functions/variables,
    // which will be stripped during the production build
    AclService._config = config;
    AclService._data = data;
    AclService._roleHasAbilities = roleHasAbilities;
    AclService._getRoleAbilities = getRoleAbilities;
    AclService._save = save;
    AclService._saveToStorage = saveToStorage;
    AclService._fetchFromStorage = fetchFromStorage;

    /* end-test-block */

    /**
     * Restore data from web storage.
     *
     * Returns true if web storage exists and false if it doesn't.
     *
     * @returns {boolean}
     */
    function resume() {
      let storeType = {
        sessionStorage: 'sessionStorage',
        localStorage: 'localStorage'
      }[config.storage];
      
      if (storeType){
        let storedData = fetchFromStorage(storeType);
        
        return storedData ? angular.extend(data, storedData) && true : false;
      }

      return false;
    }

    /**
     * Remove data from web storage
     */
    AclService.flushStorage = function () {
      unset();
    };

    /**
     * Attach a role to the current user
     *
     * @param role
     */
    AclService.attachRole = function (role) {
      if (data.roles.indexOf(role) === -1) {
        data.roles.push(role);
        save();
      }
    };

    /**
     * Remove role from current user
     *
     * @param role
     */
    AclService.detachRole = function (role) {
      var i = data.roles.indexOf(role);
      if (i > -1) {
        data.roles.splice(i, 1);
        save();
      }
    };

    /**
     * Remove all roles from current user
     */
    AclService.flushRoles = function () {
      data.roles = [];
      save();
    };

    /**
     * Check if the current user has role(s) attached
     *
     * @param role
     * @returns {boolean}
     */
    AclService.hasRole = function (role) {
      var roles = angular.isArray(role) ? role : [role];
      for (var l = roles.length; l--;) {
        if (data.roles.indexOf(roles[l]) === -1) {
          return false;
        }
      }
      return !!roles.length;
    };

    /**
     * Check if the current user any of the given roles
     *
     * @param roles
     * @returns {boolean}
     */
    AclService.hasAnyRole = function (roles) {
      for (var l = roles.length; l--;) {
        if (AclService.hasRole(roles[l])) {
          return true;
        }
      }
      return false;
    };

    /**
     * Returns the current user roles
     * @returns {Array}
     */
    AclService.getRoles = function () {
      return data.roles;
    };

    /**
     * Set the abilities object (overwriting previous abilities)
     *
     * Each property on the abilities object should be a role.
     * Each role should have a value of an array. The array should contain
     * a list of all of the roles abilities.
     *
     * Example:
     *
     *    {
     *        guest: ['login'],
     *        user: ['logout', 'view_content'],
     *        admin: ['logout', 'view_content', 'manage_users']
     *    }
     *
     * @param abilities
     */
    AclService.setAbilities = function (abilities) {
      data.abilities = abilities;
      save();
    };

    /**
     * Add an ability to a role
     *
     * @param role
     * @param ability
     */
    AclService.addAbility = function (role, ability) {
      if (!data.abilities[role]) {
        data.abilities[role] = [];
      }
      data.abilities[role].push(ability);
      save();
    };

    /**
     * Does current user have permission to do something?
     *
     * @param ability
     * @returns {boolean}
     */
    AclService.can = function (ability) {
      var role, abilities;
      // Loop through roles
      var l = data.roles.length;
      for (; l--;) {
        // Grab the the current role
        role = data.roles[l];
        abilities = getRoleAbilities(role);
        if (abilities.indexOf(ability) > -1) {
          // Ability is in role abilities
          return true;
        }
      }
      // We made it here, so the ability wasn't found in attached roles
      return false;
    };

    /**
     * Does current user have any of the required permission to do something?
     *
     * @param abilities [array]
     * @returns {boolean}
     */
    AclService.canAny = function (abilities) {
      var role, roleAbilities;
      // Loop through roles
      var l = data.roles.length;
      var j = abilities.length;

      for (; l--;) {
        // Grab the the current role
        role = data.roles[l];
        roleAbilities = getRoleAbilities(role);

        for (; j--;) {
          if (roleAbilities.indexOf(abilities[j]) > -1) {
            // Ability is in role abilities
            return true;
          }
        }
      }
      // We made it here, so the ability wasn't found in attached roles
      return false;
    };

    return {
      config: function (userConfig) {
        angular.extend(config, userConfig);
      },
      resume: resume,
      $get: function () {
        return AclService;
      }
    };

  }
]).directive('aclShow', function (AclService) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(attrs.aclShow, function aclShowWatchAction(value) {
        var permissions, can;
        if (!value) {
          element.addClass(NG_HIDE_CLASS);
          return;
        }
        permissions = value.split(',');
        can = AclService.canAny(permissions);
        if (!can) {
          element.addClass(NG_HIDE_CLASS);
        } else {
          element.removeClass(NG_HIDE_CLASS);
        }
      });
    }
  };
});
