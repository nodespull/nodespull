import { AppEnv } from "../bootstrap/boot-env/store"
import { Boot_Env } from "../bootstrap/boot-env"


Boot_Env.ensureInstanceRunning()
export const sysEnv = process.env
export const appEnv = AppEnv.storedVars