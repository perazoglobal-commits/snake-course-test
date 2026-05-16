# main.py
import pygame
import sys
from constants import *
from snake import Snake
from food import Food

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Snake Game")
    clock = pygame.time.Clock()
    font = pygame.font.SysFont("Arial", 24)
    large_font = pygame.font.SysFont("Arial", 48)

    snake = Snake()
    food = Food()
    score = 0
    current_speed = INITIAL_SPEED
    game_over = False

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            
            if event.type == pygame.KEYDOWN:
                if game_over:
                    if event.key == pygame.K_r:
                        snake.reset()
                        food.randomize_position(snake.body)
                        score = 0
                        current_speed = INITIAL_SPEED
                        game_over = False
                else:
                    if event.key == pygame.K_UP and snake.direction != pygame.K_DOWN:
                        snake.next_direction = pygame.K_UP
                    elif event.key == pygame.K_DOWN and snake.direction != pygame.K_UP:
                        snake.next_direction = pygame.K_DOWN
                    elif event.key == pygame.K_LEFT and snake.direction != pygame.K_RIGHT:
                        snake.next_direction = pygame.K_LEFT
                    elif event.key == pygame.K_RIGHT and snake.direction != pygame.K_LEFT:
                        snake.next_direction = pygame.K_RIGHT

        if not game_over:
            tail = snake.move()
            
            if snake.body[0] == food.position:
                snake.grow(tail)
                food.randomize_position(snake.body)
                score += 1
                current_speed += SPEED_INCREMENT
            
            if snake.check_collision():
                game_over = True

        # Rendering
        screen.fill(BLACK)
        
        # Draw subtle grid
        for x in range(0, WIDTH, GRID_SIZE):
            pygame.draw.line(screen, GRAY, (x, 0), (x, HEIGHT))
        for y in range(0, HEIGHT, GRID_SIZE):
            pygame.draw.line(screen, GRAY, (0, y), (WIDTH, y))

        snake.draw(screen)
        food.draw(screen)

        # Draw Score
        score_text = font.render(f"Score: {score}", True, WHITE)
        screen.blit(score_text, (10, 10))

        if game_over:
            over_text = large_font.render("GAME OVER", True, WHITE)
            restart_text = font.render("Press 'R' to Restart", True, WHITE)
            screen.blit(over_text, (WIDTH // 2 - 120, HEIGHT // 2 - 50))
            screen.blit(restart_text, (WIDTH // 2 - 100, HEIGHT // 2 + 20))

        pygame.display.flip()
        clock.tick(current_speed)

if __name__ == "__main__":
    main()
