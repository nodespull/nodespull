
export class NpLifecycle {

    static beforeServe: Function
    static afterServe: Function

    static setBeforeServe(func:Function){
        NpLifecycle.beforeServe = func
    }
    static setAfterServe(func:Function){
        NpLifecycle.afterServe = func
    }
}