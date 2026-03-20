import tkinter as tk
from tkinter import messagebox
import random

class CaroTuDo:
    def __init__(self):
        self.SIZE = 10
        self.WIN_LENGTH = 5
        self.root = tk.Tk()
        self.root.title("Cờ Caro Tự Do vs Máy - AI CỰC MẠNH (Đã nâng cấp)")
        self.root.configure(bg="#2c3e50")
        self.root.resizable(False, False)

        self.board = [['' for _ in range(self.SIZE)] for _ in range(self.SIZE)]
        self.buttons = [[None] * self.SIZE for _ in range(self.SIZE)]
        self.current_player = "X"
        self.difficulty = "hard"

        # Giao diện (giữ nguyên như code bạn gửi)
        tk.Label(self.root, text="CỜ CARO TỰ DO (10×10)", font=("Arial", 26, "bold"),
                 bg="#2c3e50", fg="#ecf0f1").pack(pady=10)

        diff_frame = tk.Frame(self.root, bg="#2c3e50")
        diff_frame.pack(pady=8)
        tk.Label(diff_frame, text="Mức độ:", font=("Arial", 14), bg="#2c3e50", fg="white").pack(side="left", padx=15)

        self.diff_var = tk.StringVar(value="hard")
        tk.Radiobutton(diff_frame, text="Dễ", variable=self.diff_var, value="easy",
                       bg="#2c3e50", fg="#2ecc71", font=("Arial", 12, "bold"),
                       command=self.change_difficulty).pack(side="left", padx=10)
        tk.Radiobutton(diff_frame, text="Khó", variable=self.diff_var, value="medium",
                       bg="#2c3e50", fg="#f1c40f", font=("Arial", 12, "bold"),
                       command=self.change_difficulty).pack(side="left", padx=10)
        tk.Radiobutton(diff_frame, text="CỰC KHÓ", variable=self.diff_var, value="hard",
                       bg="#2c3e50", fg="#e74c3c", font=("Arial", 12, "bold"),
                       command=self.change_difficulty).pack(side="left", padx=10)

        self.create_board()

        self.status = tk.Label(self.root, text="Lượt của bạn (X) - Máy: CỰC KHÓ",
                               font=("Arial", 18, "bold"), bg="#2c3e50", fg="#f1c40f")
        self.status.pack(pady=15)

        tk.Button(self.root, text="Chơi lại", font=("Arial", 14, "bold"),
                  bg="#e74c3c", fg="white", width=15, command=self.reset_game).pack(pady=15)

        self.root.mainloop()

    def change_difficulty(self):
        self.difficulty = self.diff_var.get()
        levels = {"easy": "Dễ", "medium": "Khó", "hard": "CỰC KHÓ"}
        self.status.config(text=f"Lượt của bạn (X) - Máy: {levels[self.difficulty]}")

    def create_board(self):
        frame = tk.Frame(self.root, bg="#34495e")
        frame.pack(pady=10, padx=10)
        for i in range(self.SIZE):
            for j in range(self.SIZE):
                btn = tk.Button(frame, text="", width=3, height=1, font=("Arial", 18, "bold"),
                                bg="#ecf0f1", relief="ridge", bd=3,
                                command=lambda r=i, c=j: self.player_move(r, c))
                btn.grid(row=i, column=j, padx=1, pady=1)
                self.buttons[i][j] = btn

    def player_move(self, r, c):
        if self.board[r][c] == '' and self.current_player == "X":
            self.make_move(r, c, "X")

    def make_move(self, r, c, player):
        self.board[r][c] = player
        color = "#e74c3c" if player == "X" else "#3498db"
        self.buttons[r][c].config(text=player, fg=color, state="disabled")

        if self.check_win(r, c, player):
            winner = "Bạn thắng!" if player == "X" else "Máy thắng!"
            messagebox.showinfo("🏆 Kết thúc", winner)
            self.disable_board()
            return True

        if self.is_board_full():
            messagebox.showinfo("Kết thúc", "Hòa cuộc!")
            return True

        if player == "X":
            self.current_player = "O"
            self.status.config(text="Máy đang suy nghĩ...", fg="#3498db")
            self.root.after(150, self.computer_move)
        return False

    def check_win(self, r, c, player):
        directions = [(0,1), (1,0), (1,1), (1,-1)]
        for dr, dc in directions:
            count = 1
            for k in range(1, self.WIN_LENGTH):
                if not (0 <= r + dr*k < self.SIZE and 0 <= c + dc*k < self.SIZE) or self.board[r + dr*k][c + dc*k] != player:
                    break
                count += 1
            for k in range(1, self.WIN_LENGTH):
                if not (0 <= r - dr*k < self.SIZE and 0 <= c - dc*k < self.SIZE) or self.board[r - dr*k][c - dc*k] != player:
                    break
                count += 1
            if count >= self.WIN_LENGTH:
                return True
        return False

    def is_board_full(self):
        return all(self.board[i][j] != '' for i in range(self.SIZE) for j in range(self.SIZE))

    # ===================== AI ĐÃ NÂNG CẤP =====================
    def computer_move(self):
        if self.difficulty == "easy":
            self.easy_ai()
        elif self.difficulty == "medium":
            self.medium_ai()
        else:
            self.hard_ai()   # CỰC KHÓ - Minimax Alpha-Beta cực mạnh

        self.current_player = "X"
        levels = {"easy": "Dễ", "medium": "Khó", "hard": "CỰC KHÓ"}
        self.status.config(text=f"Lượt của bạn (X) - Máy: {levels[self.difficulty]}", fg="#f1c40f")

    def easy_ai(self):
        move = self.find_immediate("O") or self.find_immediate("X")
        if move:
            self.make_move(*move, "O")
            return
        empty = [(i,j) for i in range(self.SIZE) for j in range(self.SIZE) if self.board[i][j] == '']
        if empty:
            self.make_move(*random.choice(empty), "O")

    def medium_ai(self):
        move = self.find_immediate("O") or self.find_immediate("X")
        if move:
            self.make_move(*move, "O")
            return
        center = self.SIZE // 2
        candidates = sorted([(abs(i-center) + abs(j-center), i, j) 
                           for i in range(self.SIZE) for j in range(self.SIZE) if self.board[i][j] == ''])
        if candidates:
            self.make_move(*candidates[0][1:], "O")

    def hard_ai(self):
        # 1. Thắng ngay hoặc chặn ngay
        move = self.find_immediate("O") or self.find_immediate("X")
        if move:
            self.make_move(*move, "O")
            return

        # 2. Minimax Alpha-Beta (depth động)
        best_move = self.get_best_move_minimax()
        if best_move:
            self.make_move(*best_move, "O")
        else:
            self.medium_ai()

    def find_immediate(self, player):
        for i in range(self.SIZE):
            for j in range(self.SIZE):
                if self.board[i][j] == '':
                    self.board[i][j] = player
                    if self.check_win(i, j, player):
                        self.board[i][j] = ''
                        return (i, j)
                    self.board[i][j] = ''
        return None

    # ===================== MINIMAX + ALPHA-BETA (CỰC KHÓ) =====================
    def get_best_move_minimax(self):
        best_score = -float('inf')
        best_move = None
        depth = 4 if self.count_moves() < 20 else 3   # Giảm depth khi bàn đông để chạy nhanh

        for r, c in self.get_ordered_moves():
            self.board[r][c] = 'O'
            score = self.minimax(False, depth - 1, -float('inf'), float('inf'))
            self.board[r][c] = ''
            if score > best_score:
                best_score = score
                best_move = (r, c)
        return best_move

    def minimax(self, is_maximizing, depth, alpha, beta):
        if depth == 0 or self.is_board_full():
            return self.evaluate_board()

        if is_maximizing:  # Máy O (tối đa)
            max_eval = -float('inf')
            for r, c in self.get_ordered_moves():
                self.board[r][c] = 'O'
                eval_score = self.minimax(False, depth - 1, alpha, beta)
                self.board[r][c] = ''
                max_eval = max(max_eval, eval_score)
                alpha = max(alpha, eval_score)
                if beta <= alpha:
                    break
            return max_eval
        else:  # Người X (tối thiểu)
            min_eval = float('inf')
            for r, c in self.get_ordered_moves():
                self.board[r][c] = 'X'
                eval_score = self.minimax(True, depth - 1, alpha, beta)
                self.board[r][c] = ''
                min_eval = min(min_eval, eval_score)
                beta = min(beta, eval_score)
                if beta <= alpha:
                    break
            return min_eval

    def evaluate_board(self):
        score = self.evaluate_player('O') * 1.0 - self.evaluate_player('X') * 1.05
        return score

    def evaluate_player(self, player):
        score = 0
        directions = [(0,1), (1,0), (1,1), (1,-1)]
        for i in range(self.SIZE):
            for j in range(self.SIZE):
                if self.board[i][j] != player:
                    continue
                for dr, dc in directions:
                    streak, open_ends = self.count_streak(i, j, dr, dc, player)
                    if streak >= 5:
                        return 1000000
                    elif streak == 4:
                        score += 80000 if open_ends >= 1 else 20000
                    elif streak == 3:
                        score += 12000 if open_ends == 2 else 4000
                    elif streak == 2 and open_ends == 2:
                        score += 800
        return score

    def count_streak(self, r, c, dr, dc, player):
        streak = 1
        open_ends = 0
        # Hướng +
        for k in range(1, 6):
            nr, nc = r + dr*k, c + dc*k
            if not (0 <= nr < self.SIZE and 0 <= nc < self.SIZE):
                break
            if self.board[nr][nc] == player:
                streak += 1
            elif self.board[nr][nc] == '':
                open_ends += 1
                break
            else:
                break
        # Hướng -
        for k in range(1, 6):
            nr, nc = r - dr*k, c - dc*k
            if not (0 <= nr < self.SIZE and 0 <= nc < self.SIZE):
                break
            if self.board[nr][nc] == player:
                streak += 1
            elif self.board[nr][nc] == '':
                open_ends += 1
                break
            else:
                break
        return streak, open_ends

    def get_ordered_moves(self):
        moves = []
        center = self.SIZE // 2
        for i in range(self.SIZE):
            for j in range(self.SIZE):
                if self.board[i][j] == '':
                    # Ưu tiên gần quân đã có + gần trung tâm
                    nearby = any(self.board[x][y] != '' for x in range(max(0,i-2), min(self.SIZE,i+3)) 
                                for y in range(max(0,j-2), min(self.SIZE,j+3)))
                    priority = 2000 if nearby else 0
                    priority -= (abs(i - center) + abs(j - center)) * 8
                    moves.append((priority, i, j))
        moves.sort(reverse=True)
        return [(i, j) for _, i, j in moves[:35]]  # Chỉ xét 35 nước tốt nhất → cực nhanh

    def count_moves(self):
        return sum(row.count('') == 0 for row in self.board)  # Số ô đã đánh

    def disable_board(self):
        for row in self.buttons:
            for btn in row:
                btn.config(state="disabled")

    def reset_game(self):
        self.board = [['' for _ in range(self.SIZE)] for _ in range(self.SIZE)]
        self.current_player = "X"
        for i in range(self.SIZE):
            for j in range(self.SIZE):
                self.buttons[i][j].config(text="", state="normal", bg="#ecf0f1")
        levels = {"easy": "Dễ", "medium": "Khó", "hard": "CỰC KHÓ"}
        self.status.config(text=f"Lượt của bạn (X) - Máy: {levels[self.difficulty]}", fg="#f1c40f")

if __name__ == "__main__":
    CaroTuDo()