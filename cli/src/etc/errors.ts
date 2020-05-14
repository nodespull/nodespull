
let errors = {
    db:{
        modelNotSaved,
        missingWhere_for
    }
}
export default errors;


function modelNotSaved(){
    throw Error("Tried to get a Table before saving Tables to database")
}

function missingWhere_for(action:string){
    throw Error("Missing where expression before "+action);
}