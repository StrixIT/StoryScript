namespace StoryScript {
    if (Function.prototype.proxy === undefined) {
        // This code has to be outside of the addFunctionExtensions to have the correct function scope for the proxy.
        Function.prototype.proxy = function (proxyFunction: Function, ...params) {
            var originalFunction = this;

            return (function () {
                var name = originalFunction.name;           
                var func = createNamedFunction(originalFunction, proxyFunction, name, params);
                func.isProxy = true;
                return func;
            })();
        };
    }

    export function createNamedFunction(originalFunction, proxyFunction: Function, name: string, ...params): Function {
        var namedFunction = {[name]: function () {
            var args = [].slice.call(arguments);

            if (originalFunction) {
                args.splice(0, 0, this);
                args.splice(1, 0, originalFunction);
            }
            
            return proxyFunction.apply(this, args.concat(...params));
        }}[name];

        // Making the proxy a named function as done above doesn't work in Edge. Use an additional property as a workaround.
        namedFunction.originalFunctionName = name;

        return namedFunction;
    }

    export function addFunctionExtensions() {
        if (Function.prototype.name === undefined) {
            Object.defineProperty(Function.prototype, 'name', {
                get: function () {
                    return /function ([^(]*)/.exec(this + '')[1];
                }
            });
        }

        // This allows deserializing functions added at runtime without using eval.
        // Found at https://stackoverflow.com/questions/7650071/is-there-a-way-to-create-a-function-from-a-string-with-javascript
        if (typeof String.prototype.parseFunction !== 'function') {
            (String.prototype).parseFunction = function () {
                var text = this.toString();
                var funcReg = /function[\s]*([a-zA-Z0-9]*)(\([\s\w\d,]*\))[\s]*({[\S\s]*})/gmi;
                var match = funcReg.exec(text);
        
                if (match) {
                    var args = match[2].substring(1, match[2].length - 1);
                    return new Function(args, match[3]);
                }
        
                return null;
            };
        }
    }

    export function addArrayExtensions() {
        if ((<any>Array.prototype).get === undefined) {
            Object.defineProperty(Array.prototype, 'get', {
                enumerable: false,
                value: function (id: any) {
                    if (id) {
                        return find(id, this)[0];
                    }
                    else {
                        return this[0];
                    }
                }
            });
        }

        if ((<any>Array.prototype).all === undefined) {
            Object.defineProperty(Array.prototype, 'all', {
                enumerable: false,
                value: function (id: any) {
                    return find(id, this);
                }
            });
        }

        if ((<any>Array.prototype).remove === undefined) {
            Object.defineProperty(Array.prototype, 'remove', {
                enumerable: false,
                writable: true,
                value: function (item: any) {
                    if (!item) {
                        return;
                    }

                    var entry = find(item, this)[0];

                    if (!entry) {
                        return;
                    }

                    var index = Array.prototype.indexOf.call(this, entry);

                    if (index != -1) {
                        Array.prototype.splice.call(this, index, 1);
                    }
                }
            });
        }
    }

    export function createFunctionHash(func: Function): number {
        var hash = 0;
        var functionString = func.toString();

        if (functionString.length == 0) {
            return hash;
        }

        for (var i = 0; i < functionString.length; i++) {
            var char = functionString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return hash;
    }

    export function compareString(left: string, right: string): boolean {
        if ((left === undefined && right === undefined) || (left === null && right === null)) {
            return true;
        }
        else if ((left === null || left === undefined) || (right === null  || right === undefined)) {
            return false;
        }

        return left.toLowerCase() === right.toLowerCase();
    }

    function find(id: any, array: any[]): any[] {
        if (typeof id === 'object') {
            return Array.prototype.filter.call(array, (x: any) => x === id );
        }

        id = typeof id === 'function' ? id.name || id.originalFunctionName : id;

        return Array.prototype.filter.call(array, (x: any) => { 
            var target = typeof x.target === 'function' ? x.target.name || x.target.originalFunctionName : x.target;
            return compareString(x.id, id)  || compareString(target, id);
        });
    }
}