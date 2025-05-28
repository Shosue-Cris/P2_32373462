import * as sqlite3 from 'sqlite3';


class UserModel { 
  private db: sqlite3.Database;


    constructor() {
      this.db = new sqlite3.Database('./database.sqlite', (err) => {
            if (err) {
              console.error('Error al conectar a la base de datos:', err.message);
            } else {
              console.log('Conectado a la base de datos SQLite.');
              this.createTable();
            }
          });
    }


    private createTable(): void {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT,
        created_at TEXT,
        reset_token_expires TEXT,
        reset_token TEXT

      )
    `;
    this.db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error al crear la tabla contacts:', err.message);
      } else {
        console.log('Tabla contacts verificada o creada.');
      }
    });
  }

    

    async createUser(name: string, email: string, password: string): Promise<any> {
        const createdAt = new Date().toISOString();
        const result = await this.db.run(
            'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)',
            [name, email, password, createdAt]
        );
        return result;
    }

    async findUserByUsername(username: string): Promise<any | undefined> {
        return this.db.get('SELECT * FROM users WHERE name = ?', [username]);
    }

    async findUserByEmail(email: string): Promise<any | undefined> {
        return this.db.get('SELECT * FROM users WHERE email = ?', [email]);
    }

    async saveResetToken(userId: number, token: string | null, expiration: number | null): Promise<void> {
        await this.db.run(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
            [token, expiration, userId]
        );
    }

    async findUserByResetToken(token: string): Promise<any | undefined> {
        const now = Date.now();
        return this.db.get(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?',
            [token, now]
        );
    }
}

export { UserModel };