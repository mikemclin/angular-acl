# Angular ACL

[![Build Status](https://img.shields.io/travis/mikemclin/angular-acl/master.svg?style=flat-square)](https://travis-ci.org/mikemclin/angular-acl)
[![Coverage Status](https://img.shields.io/coveralls/mikemclin/angular-acl/master.svg?style=flat-square)](https://coveralls.io/r/mikemclin/angular-acl?branch=master)

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

## Documentation

### `AclService` Methods

#### `attachRole(role)`

Attach a role to the current user

###### Parameters

| Param | Type | Example | Details |
| ----- | ---- | ------- | ------- |
| `role` | string | `'admin'` | The role label |

## Contributing

Coming soon...

## License

The MIT License

Angular ACL
Copyright (c) 2014 Mike McLin

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
