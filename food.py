# food.py
import random
import pygame
from constants import RED, GRID_SIZE, WIDTH, HEIGHT

class Food:
    def __init__(self):
        self.randomize_position([])

    def randomize_position(self, snake_body):
        while True:
            self.position = (
                random.randrange(0, WIDTH, GRID_SIZE),
                random.randrange(0, HEIGHT, GRID_SIZE)
            )
            if self.position not in snake_body:
                break

    def draw(self, surface):
        pygame.draw.rect(surface, RED, (self.position[0], self.position[1], GRID_SIZE - 1, GRID_SIZE - 1))
