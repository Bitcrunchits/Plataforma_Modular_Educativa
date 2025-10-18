// src/providers/database.provider.js

import { AppDataSource, initializeDatabase } from '../providers/datasource.providers.js';

// Solo reexportamos lo que ya existe, no creamos otro DataSource
export { AppDataSource, initializeDatabase };
