"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _() { }
const placeholders = {
    getName: _, where: _, select: _, selectAll: _, edit: _, insert: _, delete: _, as: _,
    one_to_one: _, one_to_many: _, many_to_many: _,
    linkTable: _, defineTable: _, table: _,
    model: _, define: _,
    sync: () => { return Promise.resolve(); }
};
exports.default = placeholders;
