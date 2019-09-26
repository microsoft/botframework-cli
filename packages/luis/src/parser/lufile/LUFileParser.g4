parser grammar LUFileParser;

options { tokenVocab=LUFileLexer; }

file
	: paragraph+? EOF
	;

paragraph
    : newline
    | intentDefinition
    | newEntityDefinition
    | entityDefinition
    | importDefinition
    | qnaDefinition
    | modelInfoDefinition
    ;

// Treat EOF as newline to hanle file end gracefully
// It's possible that parser doesn't even have to handle NEWLINE, 
// but before the syntax is finalized, we still keep the NEWLINE in grammer 
newline
    : NEWLINE
    | EOF
    ;

intentDefinition
	: intentNameLine newline intentBody?
	;

intentNameLine
	: HASH intentName
	;

intentName
    : intentNameIdentifier (WS|intentNameIdentifier)*
    ;

intentNameIdentifier
    : IDENTIFIER (DOT IDENTIFIER)*
    ;

intentBody
	: normalIntentBody
	;

normalIntentBody
    : (normalIntentString newline)+
    ;

normalIntentString
	: DASH (WS|TEXT|EXPRESSION|ESCAPE_CHARACTER)*
	;

newEntityDefinition
    : newEntityLine newline newEntityListbody?
    ;

newEntityListbody
    : (normalItemString newline)+
    ;

newEntityLine
    : AT newEntityType (newEntityName|newEntityNameWithWS)? (newEntityRoles|newEntityUsesFeatures)* NEW_EQUAL? (newCompositeInlineDefinition|newRegexInlineDefinition)?
    ;

newCompositeInlineDefinition
    : NEW_COMPOSITE_DECORATION_LEFT (WS|NEW_TEXT)* NEW_COMPOSITE_DECORATION_RIGHT
    ;

newRegexInlineDefinition
    : NEW_REGEX_DECORATION (WS|NEW_TEXT)* NEW_REGEX_DECORATION
    ;

newEntityType
    : NEW_ENTITY_TYPE_IDENTIFIER
    ;

newEntityRoles
    : HAS_ROLES_LABEL? (WS|NEW_TEXT)+
    ;

newEntityUsesFeatures
    : HAS_FEATURES_LABEL (WS|NEW_TEXT)+
    ;

newEntityName
    : NEW_ENTITY_IDENTIFIER
    ;

newEntityNameWithWS
    : (SINGLE_QUOTE | DOUBLE_QUOTE) (newEntityName|WS)* (SINGLE_QUOTE | DOUBLE_QUOTE) 
    ;

entityDefinition
    : entityLine newline entityListBody?
    ;
    
entityLine
    : DOLLAR entityName COLON_MARK entityType
    ;

entityName
    : (entityIdentifier|WS)*
    ;

entityType
    : (entityIdentifier|compositeEntityIdentifier|regexEntityIdentifier|SPECIAL_CHAR_MARK|COLON_MARK|WS)*
    ;

compositeEntityIdentifier
    : COMPOSITE_ENTITY
    ;

regexEntityIdentifier
    : REGEX_ENTITY
    ;

entityIdentifier
    : ENTITY_IDENTIFIER
    ;

entityListBody
    : (normalItemString newline)+
    ;

normalItemString
    : DASH (WS|TEXT)*
    ;

importDefinition
    : IMPORT_DESC IMPORT_PATH
    ;

qnaDefinition
    : qnaQuestion moreQuestionsBody qnaAnswerBody
    ;

qnaQuestion
    : QNA questionText newline
    ;

questionText
    : (WS|QNA_TEXT)*
    ;

moreQuestionsBody
    : (moreQuestion newline)*
    ;

moreQuestion
    : DASH (WS|TEXT)*
    ;

qnaAnswerBody
    : filterSection? multiLineAnswer
    ;

filterSection
    : FILTER_MARK filterLine+
    ;

filterLine
    : DASH (WS|TEXT)* newline
    ;

multiLineAnswer
    : MULTI_LINE_TEXT
    ;

modelInfoDefinition
    : MODEL_INFO
    ;