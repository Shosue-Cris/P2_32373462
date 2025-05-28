import * as sqlite3 from 'sqlite3';

export class ContactsModel {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('database.sqlite', (err) => {
      if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
      } else {
        console.log('Conectado a la base de datos SQLite.');
        this.createTable();
      }
    });
  }

  private createTable(): void {
    const createTableSQL = `CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                comment TEXT,
                ip TEXT,
                timestamp TEXT NOT NULL,
                pais TEXT NOT NULL
            )`;
    this.db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error al crear la tabla contacts:', err.message);
      } else {
        console.log('Tabla contacts verificada o creada.');
      }
    });
  }

  addContact(name: string, email: string, comment: string, ip: string, timestamp: string, pais: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const insertSQL = `
        INSERT INTO contacts (name, email, comment, ip, timestamp , pais)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      this.db.run(insertSQL, [name, email, comment, ip, timestamp, pais], function(err) {
        if (err) {
          console.error('Error al insertar contacto:', err.message);
          reject(err);
        } else {
          console.log(`Contacto insertado con ID: ${this.lastID}`);
          resolve();
        }
      });
    });
  }

  getAllContacts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const selectAllSQL = `SELECT * FROM contacts`;
      this.db.all(selectAllSQL, [], (err, rows) => {
        if (err) {
          console.error('Error al obtener contactos:', err.message);
          reject(err);
        } else {
          console.log(`Total de contactos obtenidos: ${rows}`);
          resolve(rows);
        }
      });
    });
  }

  closeConnection(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
      } else {
        console.log('Conexión a la base de datos cerrada.');
      }
    });
  }
}