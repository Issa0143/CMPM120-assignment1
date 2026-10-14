class Start extends Scene {
    enter() {
        this.engine.setTitle(this.engine.storyData.title);
        this.engine.addNavigationCell("Begin the story");
    }

    handleNavigation() {
        var start = this.engine.storyData.start;
        this.engine.gotoScene(Room, start.x, start.y, {
            "items": {},
            "collected": {},
            "steps": 0
        });
    }
}

class Room extends Scene {
    enter(x,y,player)
    {
        this.x = x;
        this.y = y;
        this.player = player;

        var roomData = this.engine.storyData.rooms[x + "_" + y];
        this.engine.showCaption(roomData.name);
        this.engine.show(roomData.description);
        player.steps += 1;
        if (roomData.items.length > 0)
        {
            var items = "Items collected: ";
            for(var item of roomData.items)
            {
                player.collected[item] = true;
                items += this.engine.itemString(item) + " ";
                if (player.items[item])
                {
                    player.items[item] += 1;
                }
                else
                {
                    player.items[item] = 1;
                }
            }
            roomData.items = [];
            this.engine.show(items);
        }
        else
        {
            this.engine.show("No items left to collect. Have you already been here?");
        }

        let end = this.engine.storyData.end || this.engine.storyData.exit;

        if (end.x == x && end.y == y)
        {
            this.endGame(player);
        }
        else
        {
            this.showControls(x, y, player);
        }
        this.engine.transition();
    }

    showControls(x, y, player)
    {
            if (player.items["newspaper"] > 0)
            {
                this.engine.addInteraction("Read newspaper", "readNewspaper");
            }

            if (player.items["cat2"] > 0 && player.items["pie"] > 0)
            {
                this.engine.addInteraction("Offer pie to cat", "feedCat");
            }

            if (player.items["banana"] > 0 && player.items["giraffe"] > 0)
            {
                this.engine.addInteraction("Feed banana to giraffe", "feedGiraffe");
            }

            // navigation cells come in a 3x3 grid
            // row 1
            this.engine.addTextCell();
            if (this.engine.storyData.rooms[x+"_"+(y-1)])
                this.engine.addNavigationCell("Go North", x, y-1, player);
            else
                this.engine.addTextCell();
            this.engine.addTextCell();

            // row 2
            if (this.engine.storyData.rooms[(x-1)+"_"+y])
                this.engine.addNavigationCell("Go West", x-1, y, player);
            else
                this.engine.addTextCell();
            this.engine.addTextCell("You are here");
            if (this.engine.storyData.rooms[(x+1)+"_"+y])
                this.engine.addNavigationCell("Go East", x+1, y, player);
            else
                this.engine.addTextCell();

            // row 3
            this.engine.addTextCell();
            if (this.engine.storyData.rooms[x+"_"+(y+1)])
                this.engine.addNavigationCell("Go South", x, y+1, player);
            else
                this.engine.addTextCell();
            this.engine.addTextCell();
    }

    handleNavigation(x,y,player) {
        let destination = this.engine.storyData.rooms[x + "_" + y];
        let requirements = destination.requires || [];

        for (let item of requirements) {
            if (!(player.items[item] > 0)) {
                this.engine.show("This room is locked. You need: " + item);
                this.showControls(this.x, this.y, player);
                return;
            }
        }

        for (let item of requirements)
        {
            player.items[item] -= 1;

            if (player.items[item] === 0)
            {
                delete player.items[item];
            }
        }

        destination.requires = [];
        
        this.engine.gotoScene(Room, x, y, player);
    }

    handleInteraction(action)
    {
        if (action === "readNewspaper")
        {
            this.engine.show("You unfold the newspaper. A handwritten note reads: 'Explore every passage carefully. Items found in one room may unlock another, and each item used to unlock a room is consumed. Once opened, that room stays unlocked.'");
        }
        else if (action === "feedCat")
        {
            this.engine.show("You offer a small piece of pie to your cat. It sniffs the crust, takes a bite, and curls up beside you with a satisfied purr.");
        }
        else if (action === "feedGiraffe")
        {
            this.engine.show("You hold out a banana, and the giraffe lowers its long neck to investigate. It gently takes the fruit and nudges your shoulder as if asking for another.");
        }
    }

    endGame(player)
    {
        this.engine.show("You have reached the exit! Congratulations!");
        var items = "Items collected:";
        for(var item in player.items)
        {
            items += this.engine.itemString(item) + " x" + player.items[item] + " ";
        }
        this.engine.show(items);
        this.engine.show("Total steps taken: " + player.steps);
        let itemPoints = Object.keys(player.collected).length * 10;
        let exitBonus = 50;
        let score = Math.max(0, itemPoints + exitBonus - player.steps);
        this.engine.show("Your score is: " + score);
        this.engine.show(this.engine.storyData.credits);
    }
}

Engine.load(Start, './myworld.json');