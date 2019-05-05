namespace StoryScript {
    export function definitionToObject<T>(definition: () => T): T {
        var definitions = window.StoryScript.ObjectFactory.GetDefinitions();
        var instance = definition();
        (<any>instance).id = definition.name;
        addFunctionIds(instance, (<any>instance).type, getDefinitionKeys(definitions));
        return instance;
    }

    export function BuildLocation<T extends ILocation>(entity: T): T {
        var definitions = window.StoryScript.ObjectFactory.GetDefinitions();
        var location = CreateObject(entity, 'locations');

        if (!definitions.dynamicLocations && !location.destinations) {
            console.log('No destinations specified for location ' + (<any>location).id);
        }

        compileFeatures(location);
        setLocationCollections(location);
        setRuntimeProperties(location, 'location');

        return location;
    }

    export function BuildEnemy<T extends IEnemy>(entity: T, type?: string): T {
        var enemy = CreateObject(entity, type || 'enemies');
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

    export function BuildPerson<T extends IPerson>(entity: T): T {
        var person = BuildEnemy(entity, 'persons');

        var quests = <IQuest[]>[];

        if (person.quests) {
            person.quests.forEach((def: () => IQuest) => {
                quests.push(definitionToObject(def));
            });

            person.quests = <any>quests;
        }

        setRuntimeProperties(person, 'person');
        return person;
    }

    export function BuildItem<T extends IItem>(entity: T): T {
        var item = CreateObject(entity, 'items');
        compileCombinations(item);
        setRuntimeProperties(item, 'item');
        return item;
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

        if (type === 'person') {
            var person = <ICompiledPerson>entity;
            createReadOnlyCollection(person, 'quests', <any>person.quests || []);
            // As far as I can tell right now, there is no reason to add quests to a person at run-time.
            //addProxy(compiledPerson, 'quest', game, ruleService);
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
        }
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

    function compileFeatures(location: ILocation) {
        if (!isEmpty(location.features)) {

            for (var i in location.features) {
                var feature = location.features[i];

                // Compile stand-alone features that are still functions.
                if (typeof feature === 'function') {
                    location.features[i] = (<() => IFeature>feature)();
                    feature = location.features[i];
                }

                feature.id = feature.name;

                if (feature.combinations && feature.combinations.combine) {
                    for (var j in feature.combinations.combine) {
                        var combination = feature.combinations.combine[j];
                        combination.tool = combination.tool && (<any>combination.tool).name;
                    }
                }
            }
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