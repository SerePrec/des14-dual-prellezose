import path, { dirname } from "path";
import { fileURLToPath } from "url";
import parseArgs from "minimist";

const argv = parseArgs(process.argv.slice(2), {
  alias: { p: ["PORT", "port"] },
  default: { p: 8080 }
});

if (process.env.NODE_ENV !== "production") {
  const { config } = await import("dotenv");
  config();
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  PORT: Number(argv.PORT) || 8080,
  fileSystemDb: {
    path: path.join(__dirname, "..", "DB"),
    messagesFile: "mensajes.json",
    productsFile: "productos.json"
  },
  mariaDb: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: process.env.MARIADB_USER || "root",
      password: process.env.MARIADB_PWD || "",
      database: process.env.MARIADB_DB || "test",
      charset: "utf8mb4"
    }
  },
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "..", "DB", "ecommerce.sqlite")
    },
    useNullAsDefault: true
  },
  mongoDb: {
    connectionString: "mongodb://localhost/des14",
    options: {
      //useNewUrlParser: true, //No necesario desde mongoose 6
      //useUnifiedTopology: true, //No necesario desde mongoose 6
      serverSelectionTimeoutMS: 5000
    },
    advancedOptions: { useUnifiedTopology: true }
  },
  mongoDbAtlas: {
    connectionString: process.env.MONGODB_ATLAS_URI,
    options: {
      //useNewUrlParser: true, //No necesario desde mongoose 6
      //useUnifiedTopology: true, //No necesario desde mongoose 6
      serverSelectionTimeoutMS: 7000
    },
    advancedOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  session: {
    secret: process.env.SESSION_SECRET || "secret"
  }
};

export default config;
