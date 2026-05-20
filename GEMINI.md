# Project Overview: Snake Game

A simple, classic Snake game implementation using Python and the `pygame` library. The project consists of a single source file that handles game logic, rendering, and user input.

## Technologies
- **Language:** Python 3.x
- **Library:** `pygame`

## Architecture
- **Single-file implementation:** `snake_game.py` contains the entire game logic.
- **Game Loop:** Utilizes a standard `while` loop to process events, update state, and render frames.
- **Procedural Logic:** Functions handle specific tasks like drawing the snake, displaying scores, and the main game loop.

## Building and Running

### Prerequisites
- Python 3.x installed.
- `pygame` library installed.

### Installation
```bash
pip install pygame
```

### Running the Game
```bash
python snake_game.py
```

## Development Conventions
- **Configuration:** Game parameters (screen size, snake speed, colors) are defined as global constants at the top of `snake_game.py`.
- **Coding Style:** Follows standard Python naming conventions (functions in `snakeCase` or `snake_case`, constants in `UPPER_CASE`).
- **Event Handling:** Standard `pygame` event queue processing for keyboard input and window management.
- **Testing:** No formal testing framework is currently used. Verification is done manually by running the game.
