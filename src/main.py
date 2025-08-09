# Dungeon Master Game - Main Entry
from dungeon import Dungeon
from gemini_api import GeminiAPI

def main():
    print("Welcome to Dungeon Master!")
    dungeon = Dungeon()
    gemini = GeminiAPI()
    # Game loop placeholder
    while True:
        command = input("Enter command: ")
        if command.lower() in ("quit", "exit"):
            print("Exiting game. Goodbye!")
            break
        # Placeholder: interact with dungeon and Gemini
        print(f"You entered: {command}")

if __name__ == "__main__":
    main()
