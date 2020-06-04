class APIFeature{
    constructor(DBQuery,query){
        this.DBQuery = DBQuery;
        this.query = query;
    }


    excludeFields(query){
        let _fields = ['page','limit','sort','fields'];
        _fields.forEach(element => {
            delete query[element];
        });
    }

    filter(){

        let _query = { ...this.query }

        this.excludeFields(_query);
        this.DBQuery.find(_query)
        return this
    }

    sort(){
        if(this.query.sort){
            let sortBy = this.query.sort.split(",").join(" ");  //http://localhost:3000/api/v1/posts?sort=content,createdAt it will come line this  { sort: 'content,createdAt' }
            this.DBQuery.sort(sortBy); // sortBy = 'content createdAt'
        }

        return this;
    }

    limitFields(){
        if(this.query.fields){
            const fields = this.query.fields.split(",").join(" ");
            this.DBQuery.select(fields);
        }else{
            this.DBQuery.select('-__v');
        }

        return this
    }

    pagination(){

        if(this.query.page && this.query.limit){
            let page  = this.query.page * 1;
            let limit = this.query.limit * 1;
            let skip = (page - 1) * limit;
            this.DBQuery.skip(skip).limit(limit)
        }
        return this

    }

}

module.exports = APIFeature