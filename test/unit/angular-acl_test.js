'use strict';

describe('AclService', function () {
  var AclService;

  beforeEach(module('mm.acl'));

  beforeEach(inject(function (_AclService_) {
    AclService = _AclService_;
  }));

  describe('attachRole()', function () {

    it('should add role to current session', function () {
      expect(AclService.hasRole('foo')).toBeFalsy();
      AclService.attachRole('foo');
      expect(AclService.hasRole('foo')).toBeTruthy();
    });

  });

});
