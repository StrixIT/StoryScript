describe("ConversationService", function() {

    it("should load a conversation", function() {
        var game = {
            currentLocation: {
                persons: [
                    {
                        id: 'friend',
                        conversation: {
                            actions: {
                                'addHedgehog': function() {}
                            }
                        }
                    }              
                ]
            }
        };

        var dataService = {
            loadDescription: function(type, item) {
                var descriptionBundle = window.StoryScript.GetGameDescriptions();
                var key = (type + '/' + item.id).toLowerCase();
                return descriptionBundle.get(key);
            }
        };

        var service = getService(game, dataService);
        service.loadConversations();

        var conversation = game.currentLocation.persons[0].conversation;
        expect(conversation.nodes.length).toBe(9);
        expect(conversation.activeNode).toBeNull();
    });

    it("should return the lines of a conversation node", function() {
        var node = {
            lines: 'My lines'
        }
        var service = getService();
        var result = service.getLines(node);

        expect(result).toBe(node.lines);
    });

    function getService(game, dataService) {
        return new StoryScript.ConversationService(dataService || {}, game || {});
    }
});