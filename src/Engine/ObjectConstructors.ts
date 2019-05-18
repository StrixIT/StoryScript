namespace StoryScript {
    export function definitionToObject<T>(definition: () => T): T {
        var definitions = window.StoryScript.ObjectFactory.GetDefinitions();
        var instance = definition();
        (<any>instance).id = definition.name;
        var type = (<any>instance).type;
        type = type === 'enemy' ? 'enemies' : type + 's';
        addFunctionIds(instance, type, getDefinitionKeys(definitions));
        return instance;
    }

    export function Location<T extends ILocation>(entity: T): T {
        var definitions = window.StoryScript.ObjectFactory.GetDefinitions();
        var location = CreateObject(entity, 'location');

        if (!definitions.dynamicLocations && !location.destinations) {
            console.log('No destinations specified for location ' + location.name);
        }

        if (!isEmpty(location.features)) {

            for (var i in location.features) {
                location.features[i] = CompileFeature(location.features[i]);
            }
        }

        setLocationCollections(location);
        setRuntimeProperties(location, 'location');

        return location;
    }

    export function Enemy<T extends IEnemy>(entity: T, type?: string): T {
        var enemy = CreateObject(entity, type || 'enemy');
        var items = <IItem[]>[];

        if (enemy.items) {
            enemy.items.forEach((def: () => IItem) => {
                items.push(definitionToObject<IItem>(def));
            });

            enemy.items = <any>items;
        }

        compileCombinations(enemy);
        setRuntimeProperties(enemy, 'enemy');
        return enemy;
    }

    export function Person<T extends IPerson>(entity: T): T {
        var person = Enemy(entity, 'person');

        var quests = <IQuest[]>[];

        if (person.quests) {
            person.quests.forEach((def: () => IQuest) => {
                quests.push(definitionToObject(def));
            });

            person.quests = <any>quests;
        }

        createReadOnlyCollection(person, 'quests', <any>person.quests || []);
        // As far as I can tell right now, there is no reason to add quests to a person at run-time.
        //addProxy(compiledPerson, 'quest', game, ruleService);
        
        return person;
    }

    export function Item<T extends IItem>(entity: T): T {
        var item = CreateObject(entity, 'item');
        compileCombinations(item);
        setRuntimeProperties(item, 'item');
        return item;
    }

    export function Key<T extends IKey>(entity: T): T {
        return Item(entity);
    }

    export function Quest<T extends IQuest>(entity: T): T {
        var item = CreateObject(entity, 'quest');
        setRuntimeProperties(item, 'quest');
        return item;
    }

    export function CompileFeature(feature: string | (() => IFeature) | IFeature): IFeature {
        var compiledFeature = <IFeature>feature;
        
        // Compile stand-alone features that are still functions.
        if (typeof feature === 'function') {
            compiledFeature = (<() => IFeature>feature)();
        }

        compiledFeature.id = compiledFeature.name.toLowerCase().replace(/\s/g,'');

        if (compiledFeature.combinations && compiledFeature.combinations.combine) {
            for (var j in compiledFeature.combinations.combine) {
                var combination = compiledFeature.combinations.combine[j];
                combination.tool = combination.tool && (<any>combination.tool).name;
            }
        }

        return compiledFeature;
    }

    export function setRuntimeProperties(entity: any, type: string) {
        if (type === 'item' || type === 'enemy' || type === 'person') {
            var combinable = <ICombinable>entity;
            
            if (combinable.combinations)
            {
                createReadOnlyCollection(combinable.combinations, 'combine', combinable.combinations.combine || []);
            }
        }

        if (type === 'enemy' || type === 'person') {
            var enemy = <ICompiledEnemy>entity;
            createReadOnlyCollection(enemy, 'items', <any>enemy.items || []);
            addProxy(enemy, 'item');
        }

        if (type ==='location') {
            var location = <ICompiledLocation>entity;

            createReadOnlyCollection(location, 'features', location.features || <any>[]);
            createReadOnlyCollection(location, 'actions', <any>location.actions || []);
            createReadOnlyCollection(location, 'combatActions', <any>location.combatActions || []);
            createReadOnlyCollection(location, 'persons', location.persons || <any>[]);
            createReadOnlyCollection(location, 'enemies', location.enemies || <any>[]);
            createReadOnlyCollection(location, 'items', location.items || <any>[]);
    
            createActiveCollections(<ICompiledLocation><unknown>location);
    
            addProxy(location, 'enemy');
            addProxy(location, 'feature');
        }
    }

    export function addFunctionIds(entity: any, type: string, definitionKeys: string[], path?: string) {
        if (!path) {
            path = entity.id || entity.name;
        }

        for (var key in entity) {
            if (!entity.hasOwnProperty(key)) {
                continue;
            }

            if (definitionKeys.indexOf(key) != -1 || key === 'target') {
                continue;
            }

            var value = entity[key];

            if (value == undefined) {
                return;
            }
            else if (typeof value === "object") {
                addFunctionIds(entity[key], type, definitionKeys, getPath(value, key, path, definitionKeys));
            }
            else if (typeof value === 'function' && !value.isProxy) {
                var functionId = path ? path + '_' + key : key;
                value.functionId = 'function#' + type + '_' + functionId + '#' + createFunctionHash(value);
            }
        }
    }

    function getPath(value, key: string, path: string, definitionKeys: string[]): string {
        if (definitionKeys.indexOf(key) != -1) {
            path = key;
        }
        else if (definitionKeys.indexOf(path) != -1 && !isNaN(parseInt(key))) {

        }
        else {
            path = path === undefined ? key : path + '_' + key;
        }

        if (value.id) {
            path = path + '_' + value.id;
        }

        return path;
    }

    function CreateObject<T>(entity: T, type: string)
    {
        // Add the type to the object so we can distinguish between them in the combine functionality.
        (<any>entity).type = type;
        return entity;
    }

    function compileCombinations(entry: ICombinable) {
        if (entry.combinations) {
            var combines = <ICombine<() => ICombinable>[]>[];
            var failText = entry.combinations.failText;

            entry.combinations.combine.forEach((combine: ICombine<() => ICombinable>) => {
                var compiled = combine;
                compiled.tool = compiled.tool && (<any>compiled.tool).name;
                combines.push(compiled);
            });

            entry.combinations.combine = combines;
            entry.combinations.failText = failText;
            createReadOnlyCollection(entry.combinations, 'combine', combines);
        }
    }

    function setLocationCollections(location: ILocation) {
        if (location.enemies) {
            var enemies = [];

            location.enemies.forEach((def: () => IEnemy) => {
                enemies.push(definitionToObject(def));
            });

            location.enemies = enemies;
        }

        if (location.persons) {
            var persons = [];

            location.persons.forEach((def: () => IPerson) => {
                persons.push(definitionToObject(def));
            });

            location.persons = persons;
        }

        if (location.items) {
            var items = [];

            location.items.forEach((def: () => IItem) => {
                items.push(definitionToObject(def));
            });

            location.items = items;
        }
    }

    function createActiveCollections(location: ICompiledLocation) {
        Object.defineProperty(location, 'activePersons', {
            get: function () {
                return location.persons.filter(e => { return !e.inactive; });
            }
        });

        Object.defineProperty(location, 'activeEnemies', {
            get: function () {
                return location.enemies.filter(e => { return !e.inactive; });
            }
        });

        Object.defineProperty(location, 'activeItems', {
            get: function () {
                return location.items.filter(e => { return !e.inactive; });
            }
        });
    }
}