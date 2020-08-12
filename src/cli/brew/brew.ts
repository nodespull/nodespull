
import cmd from "../exe/exe"

// install brew
export const downloadBrew = ()=>{
    cmd("sudo", ["/bin/bash","-c", "\"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)\""]);

}

