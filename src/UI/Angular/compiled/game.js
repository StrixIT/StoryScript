(function(window) {
    'use strict';
    
var _TestGame;
(function (_TestGame) {
    class Character {
        constructor() {
            this.name = "";
            this.score = 0;
            this.currency = 0;
            this.level = 1;
            this.hitpoints = 10;
            this.currentHitpoints = 10;
            // Add character properties here.
            this.strength = 1;
            this.agility = 1;
            this.intelligence = 1;
            this.items = [];
            this.equipment = {
                head: null,
                body: null,
                leftHand: null,
                rightHand: null,
                feet: null
            };
        }
    }
    _TestGame.Character = Character;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    function CustomTexts() {
        return {
            // Add your custom texts here.
            gameName: 'My new game',
            newGame: 'Create your character'
        };
    }
    _TestGame.CustomTexts = CustomTexts;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    function Rules() {
        return {
            setup: {
                playList: [
                // [StoryScript.GameState.CreateCharacter, 'createCharacter.mp3'],
                // [StoryScript.GameState.Play, 'play.mp3']
                ],
                intro: false,
                getCombinationActions: () => {
                    return [
                        {
                            text: 'Use',
                            preposition: 'with',
                            failText: (game, target, tool) => { return 'That is not going to work.'; }
                        },
                        {
                            text: 'Look',
                            preposition: 'at',
                            requiresTool: false,
                            failText: (game, target, tool) => { return 'There is nothing special about ' + target.name; }
                        },
                        {
                            text: 'Pull',
                            requiresTool: false,
                            failText: (game, target, tool) => { return 'You can\'t pull that.'; }
                        },
                        {
                            text: 'Push',
                            requiresTool: false,
                            failText: (game, target, tool) => { return 'You can\'t push that.'; }
                        }
                    ];
                }
            },
            general: {
                scoreChange: (game, change) => {
                    var self = this;
                    // Implement logic to occur when the score changes. Return true when the character gains a level.
                    return false;
                }
            },
            character: {
                getSheetAttributes: () => {
                    return [
                        'strength',
                        'agility',
                        'intelligence'
                    ];
                },
                getCreateCharacterSheet: () => {
                    return {
                        steps: [
                            {
                                attributes: [
                                    {
                                        question: 'What is your name?',
                                        entries: [
                                            {
                                                attribute: 'name'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                questions: [
                                    {
                                        question: 'As a child, you were always...',
                                        entries: [
                                            {
                                                text: 'strong in fights',
                                                value: 'strength',
                                                bonus: 1
                                            },
                                            {
                                                text: 'a fast runner',
                                                value: 'agility',
                                                bonus: 1
                                            },
                                            {
                                                text: 'a curious reader',
                                                value: 'intelligence',
                                                bonus: 1
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                questions: [
                                    {
                                        question: 'When time came to become an apprentice, you chose to...',
                                        entries: [
                                            {
                                                text: 'become a guard',
                                                value: 'strength',
                                                bonus: 1
                                            },
                                            {
                                                text: 'learn about locks',
                                                value: 'agility',
                                                bonus: 1
                                            },
                                            {
                                                text: 'go to magic school',
                                                value: 'intelligence',
                                                bonus: 1
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };
                },
                createCharacter: (game, characterData) => {
                    var self = this;
                    var character = new _TestGame.Character();
                    return character;
                }
            },
            combat: {
                fight: (game, enemy) => {
                    var damage = game.helpers.rollDice('1d6') + game.character.strength + game.helpers.calculateBonus(game.character, 'damage');
                    game.logToCombatLog('You do ' + damage + ' damage to the ' + enemy.name + '!');
                    enemy.hitpoints -= damage;
                    if (enemy.hitpoints <= 0) {
                        game.logToCombatLog('You defeat the ' + enemy.name + '!');
                    }
                    game.currentLocation.activeEnemies.filter((enemy) => { return enemy.hitpoints > 0; }).forEach(enemy => {
                        var damage = game.helpers.rollDice(enemy.attack) + game.helpers.calculateBonus(enemy, 'damage');
                        game.logToCombatLog('The ' + enemy.name + ' does ' + damage + ' damage!');
                        game.character.currentHitpoints -= damage;
                    });
                }
            }
        };
    }
    _TestGame.Rules = Rules;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    StoryScript.Run('_TestGame', _TestGame.CustomTexts(), _TestGame.Rules());
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Enemies;
    (function (Enemies) {
        function Bandit() {
            return _TestGame.Enemy({
                name: 'Bandit',
                hitpoints: 10,
                attack: '1d6',
                items: [
                    _TestGame.Items.Sword(),
                    _TestGame.Items.BasementKey()
                ]
            });
        }
        Enemies.Bandit = Bandit;
    })(Enemies = _TestGame.Enemies || (_TestGame.Enemies = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    function Action(action) {
        return StoryScript.Action(action);
    }
    _TestGame.Action = Action;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    function Enemy(entity) {
        return StoryScript.Enemy(entity);
    }
    _TestGame.Enemy = Enemy;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    function Feature(entity) {
        return StoryScript.Feature(entity);
    }
    _TestGame.Feature = Feature;
})(_TestGame || (_TestGame = {}));



var _TestGame;
(function (_TestGame) {
    function Item(entity) {
        return StoryScript.Item(entity);
    }
    _TestGame.Item = Item;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    function Key(entity) {
        return StoryScript.Key(entity);
    }
    _TestGame.Key = Key;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    function Location(entity) {
        return StoryScript.Location(entity);
    }
    _TestGame.Location = Location;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    function Person(entity) {
        return StoryScript.Person(entity);
    }
    _TestGame.Person = Person;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    function Quest(entity) {
        return StoryScript.Quest(entity);
    }
    _TestGame.Quest = Quest;
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Items;
    (function (Items) {
        function BasementKey() {
            return _TestGame.Key({
                name: 'Basement key',
                keepAfterUse: false,
                open: {
                    text: 'Open',
                    execute: StoryScript.Actions.OpenWithKey((game, destination) => {
                        game.logToLocationLog('You open the trap door. A wooden staircase leads down into the darkness.');
                    })
                },
                equipmentType: StoryScript.EquipmentType.Miscellaneous
            });
        }
        Items.BasementKey = BasementKey;
    })(Items = _TestGame.Items || (_TestGame.Items = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Items;
    (function (Items) {
        function Journal() {
            return _TestGame.Item({
                name: 'Joe\'s journal',
                equipmentType: StoryScript.EquipmentType.Miscellaneous,
            });
        }
        Items.Journal = Journal;
    })(Items = _TestGame.Items || (_TestGame.Items = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Items;
    (function (Items) {
        function LeatherBoots() {
            return _TestGame.Item({
                name: 'Leather boots',
                defense: 1,
                equipmentType: StoryScript.EquipmentType.Feet,
                value: 2
            });
        }
        Items.LeatherBoots = LeatherBoots;
    })(Items = _TestGame.Items || (_TestGame.Items = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Items;
    (function (Items) {
        function Sword() {
            return _TestGame.Item({
                name: 'Sword',
                damage: '3',
                equipmentType: StoryScript.EquipmentType.RightHand,
                value: 5
            });
        }
        Items.Sword = Sword;
    })(Items = _TestGame.Items || (_TestGame.Items = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Locations;
    (function (Locations) {
        function Basement() {
            return _TestGame.Location({
                name: 'Basement',
                destinations: [
                    {
                        name: 'To the garden',
                        target: Locations.Garden
                    }
                ],
                items: [
                    _TestGame.Items.Journal()
                ]
            });
        }
        Locations.Basement = Basement;
    })(Locations = _TestGame.Locations || (_TestGame.Locations = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Locations;
    (function (Locations) {
        function DirtRoad() {
            return _TestGame.Location({
                name: 'Dirt road',
                destinations: [
                    {
                        name: 'Enter your home',
                        target: Locations.Start
                    }
                ],
                enemies: [
                    _TestGame.Enemies.Bandit()
                ],
                combatActions: [
                    {
                        text: 'Run back inside',
                        execute: (game) => {
                            game.changeLocation('Start');
                            game.logToActionLog(`You storm back into your house and slam the 
                                            door behind you. You where lucky... this time!`);
                            return true;
                        }
                    }
                ]
            });
        }
        Locations.DirtRoad = DirtRoad;
    })(Locations = _TestGame.Locations || (_TestGame.Locations = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Locations;
    (function (Locations) {
        function Garden() {
            return _TestGame.Location({
                name: 'Garden',
                destinations: [
                    {
                        name: 'Enter your home',
                        target: Locations.Start,
                    }
                ],
                enterEvents: [
                    (game) => {
                        game.logToActionLog('You see a squirrel running off.');
                    }
                ],
                actions: [
                    {
                        text: 'Search the Shed',
                        execute: (game) => {
                            // Add a new destination.
                            game.currentLocation.destinations.push({
                                name: 'Enter the basement',
                                target: Locations.Basement,
                                barrier: {
                                    key: _TestGame.Items.BasementKey,
                                    name: 'Wooden trap door',
                                    actions: [
                                        {
                                            text: 'Inspect',
                                            execute: (game) => {
                                                game.logToLocationLog('The trap door looks old but still strong due to steel reinforcements. It is locked.');
                                            }
                                        }
                                    ]
                                }
                            });
                        }
                    },
                    {
                        text: 'Look in the pond',
                        execute: (game) => {
                            game.logToLocationLog(`The pond is shallow. There are frogs
                             and snails in there, but nothing of interest.`);
                        }
                    }
                ]
            });
        }
        Locations.Garden = Garden;
    })(Locations = _TestGame.Locations || (_TestGame.Locations = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Locations;
    (function (Locations) {
        function Bedroom() {
            return _TestGame.Location({
                name: 'Bedroom',
                destinations: [
                    {
                        name: 'Back to the living room',
                        target: Locations.Start
                    }
                ],
                trade: {
                    title: 'Your personal closet',
                    description: 'Do you want to take something out of your closet or put it back in?',
                    buy: {
                        description: 'Take out of closet',
                        emptyText: 'The closet is empty',
                        itemSelector: (game, item) => {
                            return item.value != undefined;
                        },
                        maxItems: 5,
                        priceModifier: 0
                    },
                    sell: {
                        description: 'Put back in closet',
                        emptyText: 'You have nothing to put in the your closet',
                        itemSelector: (game, item) => {
                            return item.value != undefined;
                        },
                        maxItems: 5,
                        priceModifier: (game) => {
                            return 0;
                        }
                    }
                }
            });
        }
        Locations.Bedroom = Bedroom;
    })(Locations = _TestGame.Locations || (_TestGame.Locations = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Locations;
    (function (Locations) {
        function Start() {
            return _TestGame.Location({
                name: 'Home',
                descriptionSelector: (game) => {
                    var date = new Date();
                    var hour = date.getHours();
                    if (hour <= 6 || hour >= 18) {
                        return 'night';
                    }
                    return 'day';
                },
                destinations: [
                    {
                        name: 'To the bedroom',
                        target: Locations.Bedroom
                    },
                    {
                        name: 'To the garden',
                        target: Locations.Garden
                    },
                    {
                        name: 'Out the front door',
                        target: Locations.DirtRoad
                    }
                ],
                persons: [
                    _TestGame.Persons.Friend()
                ]
            });
        }
        Locations.Start = Start;
    })(Locations = _TestGame.Locations || (_TestGame.Locations = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Persons;
    (function (Persons) {
        function Friend() {
            return _TestGame.Person({
                name: 'Joe',
                hitpoints: 10,
                attack: '1d6',
                items: [
                    _TestGame.Items.Sword()
                ],
                currency: 10,
                trade: {
                    ownItemsOnly: true,
                    buy: {
                        description: 'I\'m willing to part with these items...',
                        emptyText: 'I have nothing left to sell to you...',
                        itemSelector: (game, item) => {
                            return item.value != undefined;
                        },
                        maxItems: 5
                    },
                    sell: {
                        description: 'These items look good, I\'d like to buy them from you',
                        emptyText: 'You have nothing left that I\'m interested in',
                        itemSelector: (game, item) => {
                            return item.value != undefined;
                        },
                        maxItems: 5
                    }
                },
                conversation: {
                    actions: {
                        'addHedgehog': (game, person) => {
                            var garden = game.locations.get(_TestGame.Locations.Garden);
                            garden.hasVisited = false;
                            garden.enterEvents.length = 0;
                            garden.enterEvents.push((game) => {
                                game.logToLocationLog('Ah! There is the hedgehog Joe was talking about.');
                            });
                        }
                    }
                },
                quests: [
                    _TestGame.Quests.Journal()
                ]
            });
        }
        Persons.Friend = Friend;
    })(Persons = _TestGame.Persons || (_TestGame.Persons = {}));
})(_TestGame || (_TestGame = {}));

var _TestGame;
(function (_TestGame) {
    var Quests;
    (function (Quests) {
        function Journal() {
            return _TestGame.Quest({
                name: "Find Joe's journal",
                status: (game, quest, done) => {
                    return 'You have ' + (done ? '' : 'not ') + 'found Joe\'s journal' + (done ? '!' : ' yet.');
                },
                start: (game, quest, person) => {
                },
                checkDone: (game, quest) => {
                    return quest.completed || game.character.items.get(_TestGame.Items.Journal) != null;
                },
                complete: (game, quest, person) => {
                    var ring = game.character.items.get(_TestGame.Items.Journal);
                    game.character.items.remove(ring);
                    game.character.currency += 5;
                }
            });
        }
        Quests.Journal = Journal;
    })(Quests = _TestGame.Quests || (_TestGame.Quests = {}));
})(_TestGame || (_TestGame = {}));

window._TestGame = _TestGame;

})(window);
