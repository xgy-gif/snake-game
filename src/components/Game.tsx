import React, { useState, useEffect, useCallback } from 'react';

const BOARD_SIZE = 30;  // 改成30x30的网格
const INITIAL_SNAKE = [{ x: 15, y: 15 }];  // 调整初始位置到中间
const INITIAL_DIRECTION = 'RIGHT';

const Game: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 20, y: 15 });  // 调整食物初始位置
  const [gameOver, setGameOver] = useState(false);

  // 生成随机食物位置
  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
  }, []);

  // 检查是否吃到食物
  const checkFood = useCallback((head: { x: number; y: number }) => {
    return head.x === food.x && head.y === food.y;
  }, [food]);

  // 检查是否游戏结束
  const checkGameOver = useCallback((head: { x: number; y: number }) => {
    return (
      head.x < 0 ||
      head.x >= BOARD_SIZE ||
      head.y < 0 ||
      head.y >= BOARD_SIZE ||
      snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
  }, [snake]);

  // 处理键盘事件
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      const head = { ...snake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      if (checkGameOver(head)) {
        setGameOver(true);
        return;
      }

      const newSnake = [head];
      if (checkFood(head)) {
        setFood(generateFood());
        newSnake.push(...snake);
      } else {
        newSnake.push(...snake.slice(0, -1));
      }
      
      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, 300);  // 改成300毫秒
    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver, checkFood, checkGameOver, generateFood]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        width: `${BOARD_SIZE * 25}px`, 
        height: `${BOARD_SIZE * 25}px`,
        border: '2px solid black',  // 边框加粗
        position: 'relative',
        margin: '0 auto',
        backgroundColor: '#f0f0f0'  // 添加背景色
      }}>
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              width: '25px',
              height: '25px',
              backgroundColor: index === 0 ? '#4CAF50' : '#81C784',
              position: 'absolute',
              left: `${segment.x * 25}px`,
              top: `${segment.y * 25}px`,
              borderRadius: '3px',
              border: '1px solid #388E3C'  // 添加边框
            }}
          />
        ))}
        <div
          style={{
            width: '25px',
            height: '25px',
            backgroundColor: '#FF5252',
            position: 'absolute',
            left: `${food.x * 25}px`,
            top: `${food.y * 25}px`,
            borderRadius: '50%',
            border: '1px solid #D32F2F'  // 添加边框
          }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: gameOver ? '#f44336' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {gameOver ? '重新开始' : '重置游戏'}
        </button>
        {gameOver && (
          <div style={{ 
            marginTop: '10px', 
            color: '#f44336',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            游戏结束！
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;