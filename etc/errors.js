"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let errors = {
    db: {
        modelNotSaved,
        missingWhere_for
    }
};
exports.default = errors;
function modelNotSaved() {
    throw Error("Tried to get a Table before saving Tables to database");
}
function missingWhere_for(action) {
    throw Error("Missing where expression before " + action);
}
