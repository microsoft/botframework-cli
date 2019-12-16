lexer grammar LUFileLexer;

@lexer::members {
  this.ignoreWS = true;             // usually we ignore whitespace, but inside utterance, whitespace is significant
}

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
  : '**Filters:**'
  ;

MULTI_LINE_TEXT
  : '```markdown' .*? '```'
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
  : '\r'? '\n' {this.ignoreWS = true;} -> type(NEWLINE), popMode
  ;

COMMA
  : ','
  ;

NEW_EQUAL
  : '='
  ;

HAS_ROLES_LABEL
  : 'hasRole' 's'?
  ;

HAS_FEATURES_LABEL
  : 'usesFeature' 's'?
  ;

NEW_ENTITY_TYPE_IDENTIFIER
  : 'simple'|'list'|'regex'|'prebuilt'|'composite'|'ml'|'patternany'|'phraselist'|'intent'
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
  : '\r'? '\n' -> type(NEWLINE), popMode
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
  : '\r'? '\n' {this.ignoreWS = true;} -> type(NEWLINE), popMode
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
  : '\r'? '\n' {this.ignoreWS = true;} ->  type(NEWLINE), popMode
  ;

QNA_TEXT
  : ~[ \t\r\n{}]+  { this.ignoreWS = false;}
  ;