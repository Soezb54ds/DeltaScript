// This is the lexer for the DeltaScript Language.

export const tktypes = [
    'Number',
    'String',
    'Decimal',
    'Ident',
    'Num',
    'Str',
    'Dec',
    'Equals',
    'Semi-Colon',
    'LeftPar',
    'RightPar',
    'BinOp',
    'EOF'
]

const keywords = {
    'num': tktypes.indexOf('Num'),
    'str': tktypes.indexOf('Str'),
    'dec': tktypes.indexOf('Dec')
}

function token(type, value){
    return { type, value }
}

function number(str=''){
    const c = str.charCodeAt(0)
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
    return c >= bounds[0] && c <= bounds[1]
}

function ident(src=''){
    return src.toUpperCase() != src.toLowerCase()
}

function skip(src=''){
    return src == ' ' || src == '\n' || src == '\t' || src == '\r'
}

export function create_tokens(source_code=''){
    const src = source_code.split('')
    const tokens = []
    let sign = false
    while(src.length > 0){
        if(src[0] == '='){
            tokens.push(token(tktypes.indexOf('Equals'), src[0]))
            src.shift()
        }else if(src[0] == ';'){
            tokens.push(token(tktypes.indexOf('Semi-Colon'), src[0]))
            src.shift()
        }else if(src[0] == '('){
            tokens.push(token(tktypes.indexOf('LeftPar'), src[0]))
            src.shift()
        }else if(src[0] == ')'){
            tokens.push(token(tktypes.indexOf('RightPar'), src[0]))
            src.shift()
        }else if(src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/' || src[0] == "%"){
            if(src[0] == '-'){
                if(number(src[1]) == true){
                    sign = true
                    src.shift()
                }
                else{
                    tokens.push(token(tktypes.indexOf('BinOp'), '-'))
                    src.shift()
                }
            }else{
                tokens.push(token(tktypes.indexOf('BinOp'), src[0]))
                src.shift()
            }
            
        }
        else{
            let str = ''
            if(src[0] == "'"){
                // Strings
                src.shift()
                while(src.length > 0 && src[0] != "'"){
                    str += src[0]
                    src.shift()
                    if(src[0] == "'"){
                        break
                    }
                }
                tokens.push(token(tktypes.indexOf('String'), str))
            }else if(src[0] == '"'){
                // Strings
                src.shift()
                str = ''
                while(src.length > 0 && src[0] != '"'){
                    str += src[0]
                    src.shift()
                    if(src[0] == '"'){
                        break
                    }
                }
                tokens.push(token(tktypes.indexOf('String'), str))
            }else if(number(src[0]) || src[0] == '-'){
                // Numbers
                let num = ''
                let dec = ''
                while(src.length > 0 && number(src[0]) || src[0] == '-' && src[0] != '.'){
                    if(sign == true){
                        num += '-'
                        sign = false
                    }
                    num += src[0]
                    src.shift()
                    if(src[0] == '.'){
                        src.shift()
                        dec = num + '.'
                        while(src.length > 0 && number(src[0])){
                            dec += src[0]
                            src.shift()
                        }
                    }
                }
                if(dec != ''){
                    tokens.push(token(tktypes.indexOf('Decimal'), dec))
                }else{
                    tokens.push(token(tktypes.indexOf('Number'), num))
                }
            }else if(ident(src[0])){
                let i = ''
                while(src.length > 0 && ident(src[0])){
                    i += src[0]
                    src.shift()
                }
                const reserved = keywords[i]
                if(reserved == undefined){
                    tokens.push(token(tktypes.indexOf('Ident'), i))
                }else{
                    tokens.push(token(reserved, i))
                }
            }else if(skip(src[0])){
                src.shift()
            }
        }
    }
    if(tokens.length != 0){
        if(tokens[tokens.length-1].value == ""){
            tokens.pop()
        }
        tokens.push(token(tktypes.indexOf('EOF'), 'EndOfFile'))
        return tokens
    }else{
        return []
    }
}

