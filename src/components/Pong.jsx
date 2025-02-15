import React, { useState, useEffect, useRef } from "react";

const Pong = () => {
  const canvasRef = useRef(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [keys, setKeys] = useState({});
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
  const maxScore = 5;

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Tamanho dinâmico do canvas (adaptado para celular)
    canvas.width = isSmallScreen ? 300 : 800;
    canvas.height = isSmallScreen ? 500 : 600;

    let ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 5,
      dx: 3,
      dy: 3,
    };

    let paddleWidth = isSmallScreen ? 80 : 120;
    let paddleHeight = 10;

    let paddle1 = { x: (canvas.width - paddleWidth) / 2, y: canvas.height - 20 };
    let paddle2 = { x: (canvas.width - paddleWidth) / 2, y: 10 };

    let scored = false; // Variável para evitar múltiplas contabilizações de pontos

    const drawRect = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
    };

    const drawText = () => {
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(`P1: ${player1Score} - P2: ${player2Score}`, 10, canvas.height / 2);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRect(0, 0, canvas.width, canvas.height, "black");
      drawRect(paddle1.x, paddle1.y, paddleWidth, paddleHeight, "white");
      drawRect(paddle2.x, paddle2.y, paddleWidth, paddleHeight, "white");
      drawBall();
      drawText();
    };

    const resetBall = () => {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
      ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
      scored = false; // Resetar a variável de controle
    };

    const update = () => {
      if (gameOver) return;

      ball.x += ball.dx;
      ball.y += ball.dy;

      // Bola batendo nas paredes laterais
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
      }

      // Jogador 1 marca ponto
      if (ball.y - ball.radius < 0 && !scored) {
        setPlayer1Score((prev) => prev + 1);
        scored = true; // Marcar que um ponto foi contabilizado
        setTimeout(resetBall, 500); // Aguardar antes de reiniciar a bola
      }

      // Jogador 2 marca ponto
      if (ball.y + ball.radius > canvas.height && !scored) {
        setPlayer2Score((prev) => prev + 1);
        scored = true; // Marcar que um ponto foi contabilizado
        setTimeout(resetBall, 500); // Aguardar antes de reiniciar a bola
      }

      // Bola batendo nas raquetes
      if (
        ball.y + ball.radius >= paddle1.y &&
        ball.x >= paddle1.x &&
        ball.x <= paddle1.x + paddleWidth
      ) {
        ball.dy *= -1;
      }
      if (
        ball.y - ball.radius <= paddle2.y + paddleHeight &&
        ball.x >= paddle2.x &&
        ball.x <= paddle2.x + paddleWidth
      ) {
        ball.dy *= -1;
      }

      // Movimentação das raquetes
      if (keys["ArrowLeft"] && paddle1.x > 0) paddle1.x -= 5;
      if (keys["ArrowRight"] && paddle1.x + paddleWidth < canvas.width) paddle1.x += 5;
      if (keys["a"] && paddle2.x > 0) paddle2.x -= 5;
      if (keys["d"] && paddle2.x + paddleWidth < canvas.width) paddle2.x += 5;

      // Verificar fim do jogo
      if (player1Score >= maxScore || player2Score >= maxScore) {
        setGameOver(true);
      }
    };

    const loop = () => {
      draw();
      update();
      requestAnimationFrame(loop);
    };

    const handleKeyDown = (e) => setKeys((prev) => ({ ...prev, [e.key]: true }));
    const handleKeyUp = (e) => setKeys((prev) => ({ ...prev, [e.key]: false }));

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    loop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver, isSmallScreen, player1Score, player2Score]);

  const restartGame = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setGameOver(false);
    setKeys({});
  };

  return (
    <div className="flex flex-col justify-center items-center text-white bg-black min-h-screen p-4">
      <h1 className="text-xl mb-2">Pong Multiplayer</h1>
      {gameOver ? (
        <div className="text-center">
          <h2 className="text-2xl">
            {player1Score > player2Score ? "Jogador 1 Venceu!" : "Jogador 2 Venceu!"}
          </h2>
          <button onClick={restartGame} className="mt-4 p-2 bg-white text-black rounded">
            Reiniciar
          </button>
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} className="border-2 border-white"></canvas>
          {isSmallScreen && (
            <div className="flex flex-col items-center w-full mt-4 space-y-2">
              <div className="flex justify-around w-full">
                <button
                  onClick={() => setKeys((prev) => ({ ...prev, a: true }))}
                  className="p-2 bg-white text-black rounded"
                >
                  ⬅️ P2
                </button>
                <button
                  onClick={() => setKeys((prev) => ({ ...prev, d: true }))}
                  className="p-2 bg-white text-black rounded"
                >
                  ➡️ P2
                </button>
              </div>
              <div className="flex justify-around w-full">
                <button
                  onClick={() => setKeys((prev) => ({ ...prev, ArrowLeft: true }))}
                  className="p-2 bg-white text-black rounded"
                >
                  ⬅️ P1
                </button>
                <button
                  onClick={() => setKeys((prev) => ({ ...prev, ArrowRight: true }))}
                  className="p-2 bg-white text-black rounded"
                >
                  ➡️ P1
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pong;