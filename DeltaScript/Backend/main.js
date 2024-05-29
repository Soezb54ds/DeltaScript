import parse from "../Frontend/DSParse";
import { convert } from "./DSConverter";

const path = "./test.ds";
const file = Bun.file(path);

const text = await file.text();
const lines = text.split('\r')
let i = 0
while(i < lines.length){
    if(lines[i].includes('\n')){
        lines[i] = lines[i].replace('\n', '')
    }
    i += 1
}

const parser = new parse
let parsed = {}
i = 0
while(i < lines.length){
    if(lines[i] != ''){
        parsed = parser.create_ast(lines[i])
        console.log(convert(parsed))
        i += 1
    }else{
        i += 1
    }
}
