// This is the transpiler for DeltaScript which converts DeltaScript to C++

import parse from "../Frontend/DSParse";

// { left, right, op }

function eval_numeric_exp(left, op, right){
    switch(op){
        case '+':
            return left + ' ' + op + ' ' + right
        case '-':
            return left + ' ' + op + ' ' + right
        case '*':
            return left + ' ' + op + ' ' + right
        case '/':
            return left + op + right
    }
}
function eval_binexp(astnode){
    const left = astnode.left.kind === "BinaryExpr" ? eval_binexp(astnode.left) : astnode.left.value;
    const right = astnode.right.kind === "BinaryExpr" ? eval_binexp(astnode.right) : astnode.right.value;
    const op = astnode.op;

    return eval_numeric_exp(left, op, right);
}

export function convert(ast){
    const bd = ast.body
    let idx = 0
    let inst_line = ''
    while(idx < bd.length){
        if(bd[idx].kind == "Identifier"){
            inst_line += bd[idx].symbol
        }else if(bd[idx].kind == "VarDec"){
            if(bd[idx].type == 'NumDec'){
                if(bd[idx].value.kind == 'BinaryExpr'){
                    inst_line += 'int ' + bd[idx].name + ' = ' + eval_binexp(bd[idx].value) + ';'
                }else if(bd[idx].value.kind == 'NumericLiteral'){
                    inst_line += 'int ' + bd[idx].name + ' = ' + bd[idx].value.value + ';'
                }
            }else if(bd[idx].type == 'StrDec'){
                inst_line += 'string ' + bd[idx].name + ' = "' + bd[idx].value.value.concat('"') + ';'
            }else if(bd[idx].type == 'DenDec'){
                if(bd[idx].value.kind == 'BinaryExpr'){
                    inst_line += 'double ' + bd[idx].name + ' = ' + eval_binexp(bd[idx].value) + ';'
                }else if(bd[idx].value.kind == 'DenaricLiteral'){
                    inst_line += 'double ' + bd[idx].name + ' = ' + bd[idx].value.value + ';'
                }
            }
        }else if(bd[idx].kind == "NumericLiteral"){
            inst_line += bd[idx].value
        }else if(bd[idx].kind == "StringLiteral"){
            inst_line += bd[idx].value
        }else if(bd[idx].kind == "DenaricLiteral"){
            inst_line += bd[idx].value
        }else if(bd[idx].kind == "BinaryExpr"){
            inst_line += eval_binexp(bd[idx])
        }
        idx += 1
    }
    return inst_line
}
