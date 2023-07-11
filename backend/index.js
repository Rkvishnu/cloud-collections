const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database:process.env.RDS_DBNAME
});

exports.handler = async (event, context) => {
  try {
    
    const tableExists = await checkTableExists(connection, 'collections');
    if (!tableExists) {
      await createCollectionsTable(connection);
    }
    
    await createCollectionsTable(connection);
    const { httpMethod, pathParameters = {} } = event;
    const { collectionId } = pathParameters;

    switch (httpMethod) {
      case 'GET':
        const collection = await fetchCollection(connection, collectionId);
        return {
          statusCode: 200,
          body: JSON.stringify(collection),
        };
      case 'POST':
        const { name, description } = JSON.parse(event.body);
        await createCollection(connection, name, description);
        return {
          statusCode: 201,
          body: JSON.stringify({ message: 'Collection created successfully' }),
        };
      case 'PUT':
        const { newName, newDescription } = JSON.parse(event.body);
        await updateCollection(connection, collectionId, newName, newDescription);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Collection updated successfully' }),
        };
      case 'DELETE':
        await deleteCollection(connection, collectionId);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Collection deleted successfully' }),
        };
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Invalid request' }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  } finally {
    if (connection) {
      connection.end();
    }
  }
};



//function to creatte table 
function createCollectionsTable(connection) {
  return new Promise((resolve, reject) => {
    connection.query(
      `CREATE TABLE IF NOT EXISTS collections(
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
            )`,
      (error) => {
        if (error) {
          reject(error.message);
        } else {
          
          resolve();
          console.log('table created successfully')
        }
      }
    );
  });
}


// Function to check if a table exists
function checkTableExists(connection, tableName) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SHOW TABLES LIKE '${tableName}'`,
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0);
        }
      }
    );
  });
}


function fetchCollection(connection, collectionId) {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM collections WHERE id = ?',
      [collectionId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function createCollection(connection, name, description) {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO collections (name, description) VALUES (?, ?)',
      [name, description],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

function updateCollection(connection, collectionId, newName, newDescription) {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE collections SET name = ?, description = ? WHERE id = ?',
      [newName, newDescription, collectionId],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

function deleteCollection(connection, collectionId) {
  return new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM collections WHERE id = ?',
      [collectionId],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}
