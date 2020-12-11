const pool = require('../db/index')

module.exports = class Card{
    constructor({user_id, collection_id, front, back}){
        this.user_id = user_id
        this.collection_id = collection_id
        this.front = front
        this.back = back
    }

    async save(){
        try{ 
            return await pool.query(
            'INSERT INTO cards (user_id, collection_id, front, back, created, card_status, scheduled_review) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [this.user_id, this.collection_id, this.front, this.back, new Date(), 'new', new Date()]
        )}catch(e){
            throw e
        }
    }

    static createModel(candidate){
        return {
            id: candidate.rows[0].id,
            user_id: candidate.rows[0].user_id,
            collection_id: candidate.rows[0].collection_id,
            front: candidate.rows[0].front,
            back: candidate.rows[0].back,
            created: candidate.rows[0].created,
            status: candidate.rows[0].status,
            last_review: candidate.rows[0].last_review,
            scheduled_review: candidate.rows[0].scheduled_review,
            last_edited: candidate.rows[0].last_edited
        }
    }

    static async findOne({id, user_id}){
        let candidate
        if(id){
            candidate = await pool.query('SELECT * FROM cards WHERE id=$1 AND user_id=$2 FETCH FIRST ROW ONLY', [id, user_id])
        }
        else{
            return null
        }

        if(candidate.rowCount === 0) return null

        return this.createModel(candidate)
    }

    static async find({user_id}){

        let data = await pool.query('SELECT * FROM cards WHERE user_id=$1', [user_id])
        console.log(data)
        return data.rows.map(candidate => this.createModel(candidate))
    }
}