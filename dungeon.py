# Dungeon logic
class Dungeon:
    def __init__(self):
        self.rooms = []
        self.monsters = []
        self.resources = {}
        self.init_dungeon()

    def init_dungeon(self):
        # Initialize dungeon with default rooms, monsters, resources
        self.rooms = ["Entrance Hall", "Treasure Room", "Boss Lair"]
        self.monsters = ["Goblin", "Skeleton", "Dragon"]
        self.resources = {"gold": 100, "traps": 3}

    def status(self):
        return {
            "rooms": self.rooms,
            "monsters": self.monsters,
            "resources": self.resources
        }
