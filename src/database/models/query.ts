
export interface RawQueryResponse {
    results: any[],
    metadata: any
}

export interface QueryInterface{
    /** 
     * Add a new column to a table: async
     * @param {string} table
     * @param {string} key
     * @param {any} attribute
     * @param {any} options
     * @return {Promise} Promise 
    */
    addColumn:Function,
    /**
     * Add a constraint to a table
     * @param {string} tableName
     * @param {any} options
     * @return {Promise} Promise
     */
    addConstraint:Function,
    /**
     * Add an index to a column
     * @param {string|any} tableName
     * @param {Array} attributes
     * @param {any} options
     * @param {string} rawTablename
     * @return {Promise} Promise
     */
    addIndex:Function,
    /**
     * Delete multiple records from a table
     * @param {string} tableName
     * @param {any} where
     * @param {any} options
     * @param {Model} model
     * @return {Promise} Promise
     */
    bulkDelete:Function,
    /**
     * Insert multiple records into a table
     * @param {string} tableName
     * @param {Array} records
     * @param {any} options
     * @param {any} attributes
     * @return {Promise} Promise
     */
    bulkInsert:Function,
    /**
     * Update multiple records of a table
     * @param {string} tableName
     * @param {any} values
     * @param {any} identifier
     * @param {any} options
     * @param {any} attributes
     * @return {Promise} Promise
     */
    bulkUpdate:Function,
    /**
     * 
     */
    changeColumn:Function,
    /**
     * 
     */
    createDatabase:Function,
    /**
     * 
     */
    createFunction:Function,
    /**
     * 
     */
    createSchema:Function,
    /**
     * 
     */
    createTable:Function,
    /**
     * 
     */
    describeTable:Function,
    /**
     * 
     */
    dropAllTables:Function,
    /**
     * 
     */
    dropDatabase:Function,
    /**
     * 
     */
    dropFunction:Function,
    /**
     * 
     */
    dropSchema:Function,
    /**
     * 
     */
    dropTable:Function,
    /**
     * 
     */
    getForeignKeyReferencesForTable:Function,
    /**
     * 
     */
    getForeignKeysForTables:Function,
    /**
     * 
     */
    removeColumn:Function,
    /**
     * 
     */
    removeConstraint:Function,
    /**
     * 
     */
    removeIndex:Function,
    /**
     * 
     */
    renameColumn:Function,
    /**
     * 
     */
    renameFunction:Function,
    /**
     * 
     */
    renameTable:Function,
    /**
     * 
     */
    showAllSchemas:Function,
    /**
     * 
     */
    upsert:Function





}