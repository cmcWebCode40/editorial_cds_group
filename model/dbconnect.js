    const {Pool} = require("pg");
    const config = require("../config")
    
    class Db{
        constructor(tableName){
            this.tablename = tableName;
            let connection=config.db;
            this.pool = new Pool(connection);
        }

        async query(query){
            let result = await this.queryAction(query);
            return result.rows;
        }
        async queryAction(query){
            return await this.pool.query(query);
        }
    
         async allTables(){
            let result = await this.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
            return result.map((e)=>e.table_name);
        }

        async createTable(value){
            await this.queryAction(`CREATE TABLE IF NOT EXISTS ${this.tablename}(${value})`);
        }
        
        async dropTable(tableName){
            let allTables = await this.allTables();
            (allTables.includes(tableName))? await this.query(`DROP TABLE  ${tableName}`) : "";
            return await this.allTables()
        }

        async dropAllTables(){
            const allTables = await this.allTables();
            await allTables.map(async(table)=>await this.dropTable(table))
        }

        async find(param){
            if(!param) param ={};
            let {condition, limit, orderby} = param; 
            
            orderby = (orderby)? "ORDER BY date DESC" : "";
           
            condition = (condition)? "WHERE "+ condition : "";
            limit = (limit)? " limit " + limit : "";
            

            return await this.query(`select * from ${this.tablename} ${condition} ${limit} ${orderby}`)
        }


        async insert(col, values){
            values = values.map((value)=>{return "'"+`${value}`+"'"})
            return await this.query(`INSERT INTO ${this.tablename}(id, ${col}) VALUES(DEFAULT, ${values})`);
        }
        async insertI(param){
            let col = Object.keys(param)
            let values = Object.values(param)
            values = values.map((value)=>{return "'"+`${value}`+"'"})
            return await this.query(`INSERT INTO ${this.tablename}(id, ${col}) VALUES(DEFAULT, ${values})`);
        }

        async delete(condition){
            condition = Object.keys(condition).map((key)=>`${key} = ${condition[key]}`)
            return await this.query(`DELETE FROM ${this.tablename} WHERE ${condition}`);
        }

        async deleteById(id){
            await this.delete({id:id});
        }

        async update(values, condition){
            values = Object.keys(values).map((key)=>`${key} = `+ "'" + `${values[key]}` +"'");
            condition = (condition)? "WHERE "+ condition : "";

            return await this.query(`UPDATE ${this.tablename} SET ${values} ${condition}`)
        }

        async updateById(values, id){
            await this.update(values, `id = ${id}`)
        }

    }


module.exports = Db;

     
    
 