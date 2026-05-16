# snake.py
import pygame
from constants import GREEN, GRID_SIZE, WIDTH, HEIGHT

class Snake:
    def __init__(self):
        self.reset()

    def reset(self):
        self.body = [
            (WIDTH // 2, HEIGHT // 2),
            (WIDTH // 2 - GRID_SIZE, HEIGHT // 2),
            (WIDTH // 2 - 2 * GRID_SIZE, HEIGHT // 2)
        ]
        self.direction = pygame.K_RIGHT
        self.next_direction = pygame.K_RIGHT

    def move(self):
        self.direction = self.next_direction
        head_x, head_y = self.body[0]

        if self.direction == pygame.K_UP:
            new_head = (head_x, head_y - GRID_SIZE)
        elif self.direction == pygame.K_DOWN:
            new_head = (head_x, head_y + GRID_SIZE)
        elif self.direction == pygame.K_LEFT:
            new_head = (head_x - GRID_SIZE, head_y)
        elif self.direction == pygame.K_RIGHT:
            new_head = (head_x + GRID_SIZE, head_y)

        self.body.insert(0, new_head)
        return self.body.pop()

    def grow(self, tail):
        self.body.append(tail)

    def check_collision(self):
        head = self.body[0]
        # Wall collision
        if head[0] < 0 or head[0] >= WIDTH or head[1] < 0 or head[1] >= HEIGHT:
            return True
        # Self collision
        if head in self.body[1:]:
            return True
        return False

    def draw(self, surface):
        for segment in self.body:
            pygame.draw.rect(surface, GREEN, (segment[0], segment[1], GRID_SIZE - 1, GRID_SIZE - 1))
