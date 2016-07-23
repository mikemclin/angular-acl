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
      expect(AclService._data.roles).toEqual([]);
      AclService.attachRole('foo');
      expect(AclService._data.roles).toEqual(['foo']);
    });

    it('should add role only once', function () {
      expect(AclService._data.roles).toEqual([]);
      AclService.attachRole('foo');
      AclService.attachRole('foo');
      AclService.attachRole('foo');
      expect(AclService._data.roles).toEqual(['foo']);
    });

  });

  describe('detachRole()', function () {

    it('should remove role to current session', function () {
      AclService._data.roles = ['foo'];
      AclService.detachRole('foo');
      expect(AclService._data.roles).toEqual([]);
    });

    it('should not throw an error if role does not exist', function () {
      expect(AclService._data.roles).toEqual([]);
      AclService.detachRole('foo');
      expect(AclService._data.roles).toEqual([]);
    });

  });

  describe('flushRole()', function () {

    it('should reset roles to an empty array', function () {
      AclService._data.roles = ['foo', 'bar', 'baz'];
      expect(AclService._data.roles).toEqual(['foo', 'bar', 'baz']);
      AclService.flushRoles();
      expect(AclService._data.roles).toEqual([]);
    });

  });

  describe('hasRole()', function () {

    it('should return true if role is in current session', function () {
      AclService._data.roles = ['foo'];
      expect(AclService.hasRole('foo')).toBeTruthy();
    });

    it('should return true if all roles are in current session', function () {
      AclService._data.roles = ['foo', 'bar'];
      expect(AclService.hasRole(['foo', 'bar'])).toBeTruthy();
    });

    it('should return false if role is not in current session', function () {
      AclService._data.roles = [];
      expect(AclService.hasRole('foo')).toBeFalsy();
    });

    it('should return false if all roles are not in current session', function () {
      AclService._data.roles = ['foo', 'bar'];
      expect(AclService.hasRole(['foo', 'bar', 'baz'])).toBeFalsy();
    });

  });

  describe('hasAnyRole()', function () {

    it('should return true if role is in current session', function () {
      AclService._data.roles = ['foo'];
      expect(AclService.hasAnyRole(['foo'])).toBeTruthy();
    });

    it('should return true if only some roles are in current session', function () {
      AclService._data.roles = ['foo'];
      expect(AclService.hasAnyRole(['foo', 'bar'])).toBeTruthy();
    });

    it('should return false if role is not in current session', function () {
      AclService._data.roles = [];
      expect(AclService.hasAnyRole(['foo'])).toBeFalsy();
    });

  });

  describe('getRoles()', function () {

    it('should return all the roles in current session', function () {
      AclService._data.roles = ['foo', 'bar'];
      expect(AclService.getRoles()).toEqual(['foo', 'bar']);
    });

  });

  describe('setAbilities()', function () {

    it('should set given param to abilities', function () {
      expect(AclService._data.abilities).not.toEqual('foo');
      AclService.setAbilities('foo');
      expect(AclService._data.abilities).toEqual('foo');
    });

  });

});
