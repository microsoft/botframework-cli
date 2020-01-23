lexer grammar LUFileLexer;

@lexer::members {
  var ignoreWS = true;             // usually we ignore whitespace, but inside utterance, whitespace is significant
}

// fragments
fragment A: 'a' | 'A';
fragment B: 'b' | 'B';
fragment C: 'c' | 'C';
fragment D: 'd' | 'D';
fragment E: 'e' | 'E';
fragment F: 'f' | 'F';
fragment G: 'g' | 'G';
fragment H: 'h' | 'H';
fragment I: 'i' | 'I';
fragment J: 'j' | 'J';
fragment K: 'k' | 'K';
fragment L: 'l' | 'L';
fragment M: 'm' | 'M';
fragment N: 'n' | 'N';
fragment O: 'o' | 'O';
fragment P: 'p' | 'P';
fragment Q: 'q' | 'Q';
fragment R: 'r' | 'R';
fragment S: 's' | 'S';
fragment T: 't' | 'T';
fragment U: 'u' | 'U';
fragment V: 'v' | 'V';
fragment W: 'w' | 'W';
fragment X: 'x' | 'X';
fragment Y: 'y' | 'Y';
fragment Z: 'z' | 'Z';

fragment LETTER: 'a'..'z' | 'A'..'Z';
fragment NUMBER: '0'..'9';

fragment WHITESPACE
  : ' '|'\t'|'\ufeff'|'\u00a0'
  ;

fragment UTTERANCE_MARK: '-' | '*' | '+';

MODEL_INFO
  : WS* '>' WHITESPACE* '!#' ~('\r'|'\n')+
  ;

COMMENT
  : WS* '>' ~('\r'|'\n')+ -> skip
  ;

WS
  : WHITESPACE+
  ;

NEWLINE
  : '\r'? '\n' -> skip
  ;

QNA
  : '#'+ WHITESPACE+ '?' {this.ignoreWS = false;} -> pushMode(QNA_MODE)
  ;

HASH
  : '#' {this.ignoreWS = true;} -> pushMode(INTENT_NAME_MODE)
  ;

DASH
  : UTTERANCE_MARK {this.ignoreWS = true;} -> pushMode(LIST_BODY_MODE)
  ;

DOLLAR
  : '$' {this.ignoreWS = true;} -> pushMode(ENTITY_MODE)
  ;

AT
  : '@' {this.ignoreWS = true;} -> pushMode(NEW_ENTITY_MODE)
  ;

IMPORT_DESC
  : '[' .*? ']'
  ;

IMPORT_PATH
  : '(' .*? ')'
  ;

FILTER_MARK
  : '**' F I L T E R S ':**'
  ;

MULTI_LINE_TEXT
  : '```' .*? '```'
  ;
PROMPT_MARK
  : '**' P R O M P T S ':**'
  ;
  
INVALID_TOKEN_DEFAULT_MODE
  : .
  ;
  
mode NEW_ENTITY_MODE;

WS_IN_NEW_ENTITY_IGNORED
  : WHITESPACE+ {this.ignoreWS}? -> skip
  ;

WS_IN_NEW_ENTITY
  : WHITESPACE+ -> type(WS)
  ;

NEWLINE_IN_NEW_ENTITY
  : '\r'? '\n' {this.ignoreWS = true;} -> skip, popMode
  ;

COMMA
  : ','
  ;

NEW_EQUAL
  : '='
  ;

HAS_ROLES_LABEL
  : H A S R O L E S?
  ;

HAS_FEATURES_LABEL
  : U S E S F E A T U R E S?
  ;

NEW_ENTITY_TYPE_IDENTIFIER
  : S I M P L E | L I S T | R E G E X | P R E B U I L T | C O M P O S I T E | M L | P A T T E R N A N Y | P H R A S E L I S T | I N T E N T
  ;

NEW_ENTITY_IDENTIFIER
  : (LETTER | NUMBER | '_' | '-' | '|' | '.' | '(' | ')')+
  ;

NEW_ENTITY_IDENTIFIER_WITH_WS
  : ('\'' | '"') (LETTER | NUMBER | '_' | '-' | '|' | '.' | WS)+ ('\'' | '"')
  ;

NEW_COMPOSITE_ENTITY
  : '[' (~[\r\n{}[()])* ']'
  ;

NEW_REGEX_ENTITY
  : '/' (~[\r\n])* '/'
  ;

NEW_TEXT
  : ~[ \t\r\n.,;]+ 
  ;

mode INTENT_NAME_MODE;

WS_IN_NAME_IGNORED
  : WHITESPACE+ {this.ignoreWS}? -> skip
  ;

WS_IN_NAME
  : WHITESPACE+ -> type(WS)
  ;

HASH_IN_NAME
  : '#' -> type(HASH)
  ;
  
NEWLINE_IN_NAME
  : '\r'? '\n' -> skip, popMode
  ;

IDENTIFIER
  : (LETTER | NUMBER | '_') (LETTER | NUMBER | '-' | '_')* { this.ignoreWS = false;}
  ;

DOT
  : '.'
  ;

mode LIST_BODY_MODE;

// a little tedious on the rules, a big improvement on portability
WS_IN_LIST_BODY_IGNORED
  : WHITESPACE+  {this.ignoreWS}? -> skip
  ;

WS_IN_LIST_BODY
  : WHITESPACE+  -> type(WS)
  ;

NEWLINE_IN_LIST_BODY
  : '\r'? '\n' {this.ignoreWS = true;} -> type(NEWLINE), popMode
  ;

ESCAPE_CHARACTER
  : '\\{' | '\\[' | '\\\\' | '\\'[rtn\]}]  { this.ignoreWS = false;}
  ;

EXPRESSION
  : '{' (~[\r\n{}] | ('{' ~[\r\n]* '}'))* '}'  { this.ignoreWS = false;}
  ;

TEXT
  : ~[ \t\r\n{}]+  { this.ignoreWS = false;}
  ;

mode ENTITY_MODE;

WS_IN_ENTITY_IGNORED
  : WHITESPACE+ {this.ignoreWS}? -> skip
  ;

WS_IN_ENTITY
  : WHITESPACE+ -> type(WS)
  ;

NEWLINE_IN_ENTITY
  : '\r'? '\n' {this.ignoreWS = true;} -> skip, popMode
  ;

COMPOSITE_ENTITY
  : '[' (~[\r\n{}[()])*
  ;

REGEX_ENTITY
  : '/' (~[\r\n])*
  ;

ENTITY_TEXT
  : ~[ \t\r\n:]+ { this.ignoreWS = false;}
  ;

COLON_MARK
  : ':'
  ;

mode QNA_MODE;

WS_IN_QNA_IGNORED
  : WHITESPACE+ {this.ignoreWS}? -> skip
  ;

WS_IN_QNA
  : WHITESPACE+ -> type(WS)
  ;

NEWLINE_IN_QNA
  : '\r'? '\n' {this.ignoreWS = true;} ->  skip, popMode
  ;

QNA_TEXT
  : ~[ \t\r\n{}]+  { this.ignoreWS = false;}
  ;