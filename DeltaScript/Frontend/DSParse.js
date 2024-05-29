// This is the parser for the DeltaScript Language.

import { tktypes, create_tokens } from "./DSLexer";

export default class parse{
    tokens = []

    neof(){
        return this.at().type != tktypes.indexOf('EOF')
    }

    at(){
        return this.tokens[0]
    }

    eat(){
        const prev = this.tokens.shift()
        return prev
    }

    expect(type=0, err) {
        const prev = this.tokens.shift()
        if (!prev || prev.type != type) {
          console.error("Uncaught Parser Error:\n", err, prev, " - Expecting: ", type)
          process.exit()
        }
    
        return prev
      }
    

    create_ast(source=''){
        const program = {
            kind: "Program",
            body: []
        }
        this.tokens = create_tokens(source)
        while(this.neof()){
            program.body.push(this.parse_stmt())
        }

        return program
    }

    parse_stmt(){
        return this.parse_expr()
    }

    parse_expr(){
        return this.parse_variable_dec()
    }

    parse_variable_dec(){
        let var_name = ''
        let decl = {}
        let var_value = {}
        decl = this.at().type
        switch(decl){
            case tktypes.indexOf('Num'):
                this.eat()
                var_name = this.eat().value
                this.eat()
                var_value = this.parse_additive_expr()
                if(var_value.kind == "NumericLiteral" || var_value.kind == "BinaryExpr"){
                  return {
                    kind: "VarDec",
                    type: "NumDec",
                    name: var_name,
                    value: var_value,
                  }
                }else{
                  console.error('Uncaught (Parser) Error: Variable is defined as a "NumDec"(Integer). It cannot obtain any other type other than Number. But, Found:', var_value.kind)
                  process.exit()
                }
            case tktypes.indexOf('Str'):
                this.eat()
                var_name = this.eat().value
                this.eat()
                var_value = this.parse_primary_expr()
                if(var_value.kind == "StringLiteral"){
                  return {
                    kind: "VarDec",
                    type: "StrDec",
                    name: var_name,
                    value: var_value
                  }
                }else{
                  console.error('Uncaught (Parser) Error: Variable is defined as a "StrDec"(String). It cannot obtain any other type other than String. But, Found:', var_value.kind)
                  process.exit()
                }
            case tktypes.indexOf('Dec'):
                this.eat()
                var_name = this.eat().value
                this.eat()
                var_value = this.parse_additive_expr()
                if(var_value.kind == "DenaricLiteral" || var_value.kind == "BinaryExpr"){
                  return {
                    kind: "VarDec",
                    type: "DenDec",
                    name: var_name,
                    value: var_value
                  }
                }else{
                  console.error('Uncaught (Parser) Error: Variable is defined as a "DenDec"(Decimal). It cannot obtain any other type other than Decimal. But, Found:', var_value.kind)
                  process.exit()
                }
            default:
                return this.parse_additive_expr()
        }
    }

    parse_additive_expr(){
        let left_node = this.parse_multiplicative_expr();
        while (this.at().value == "+" || this.at().value == "-") {
          const operator = this.eat().value;
          const right_node = this.parse_multiplicative_expr();
          left_node = {
              kind: "BinaryExpr",
              left: left_node,
              right: right_node,
              op: operator,
          }
      }
      return left_node;
    }

    parse_multiplicative_expr(){
        let left_node = this.parse_primary_expr();

        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
        const operator = this.eat().value;
        const right_node = this.parse_primary_expr();
        left_node = {
            kind: "BinaryExpr",
            left: left_node,
            right: right_node,
            op: operator,
        }
    }

    return left_node;
    }

    parse_primary_expr(){
        const tk = this.at().type;
        switch (tk) {
          case tktypes.indexOf('Ident'):
            return { kind: "Identifier", value: this.eat().value }

          case tktypes.indexOf('Equals'):
            return { kind: "Equals", symbol: this.eat().value }

          case tktypes.indexOf('Number'):
            return {
              kind: "NumericLiteral",
              value: this.eat().value
            }

          case tktypes.indexOf('String'):
            return {
              kind: "StringLiteral",
              value: this.eat().value
            }
          
          case tktypes.indexOf('Decimal'):
            return {
              kind: "DenaricLiteral",
              value: this.eat().value,
            }

          case tktypes.indexOf('LeftPar'): {
            this.eat(); 
            const value = this.parse_expr();
            this.expect(
              tktypes.indexOf('RightPar'),
              "Unexpected token found inside parenthesised expression. Expecting Right parenthesis.",
            )
            return value;
          }

          case tktypes.indexOf('EOF'):
            break

          default:
            console.error("Unexpected token found during parsing!", this.at())
            process.exit()
        }
    }
}

