'use strict';

describe('AclService', function () {
  var AclService;

  beforeEach(module('mm.acl'));

  beforeEach(inject(function (_AclService_) {
    AclService = _AclService_;
  }));

  describe('roleHasAbilities()', function () {

    it('should return true data object has role as a property with an array value', function () {
      expect(AclService._roleHasAbilities('foo')).toBeFalsy();
      AclService._data.abilities.foo = [];
      expect(AclService._roleHasAbilities('foo')).toBeTruthy();
    });

  });

  describe('getRoleAbilities()', function () {

    it('should return the role abilities array', function () {
      AclService._data.abilities.foo = ['bar', 'baz'];
      var abilities = AclService._getRoleAbilities('foo');
      expect(abilities).toEqual(['bar', 'baz']);
    });

    it('should return empty array when role does not exist', function () {
      var abilities = AclService._getRoleAbilities('foo');
      expect(abilities).toEqual([]);
    });

  });

  describe('attachRole()', function () {

    it('should add role to current session', function () {
      expect(AclService._data.roles.indexOf('foo')).toEqual(-1);
      AclService.attachRole('foo');
      expect(AclService._data.roles.indexOf('foo')).toEqual(0);
    });

  });

});
