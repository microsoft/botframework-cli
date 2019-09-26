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
    : AT newEntityType (newEntityName|newEntityNameWithWS) newEntityRoles? newEntityUsesFeatures? NEW_EQUAL? (newCompositeDefinition|newRegexDefinition)?
    ;

newCompositeDefinition
    : NEW_COMPOSITE_ENTITY
    ;

newRegexDefinition
    : NEW_REGEX_ENTITY
    ;

newEntityType
    : NEW_ENTITY_TYPE_IDENTIFIER
    ;

newEntityRoles
    : HAS_ROLES_LABEL? newEntityRoleOrFeatures
    ;

newEntityUsesFeatures
    : HAS_FEATURES_LABEL newEntityRoleOrFeatures
    ;

newEntityRoleOrFeatures
    : text (COMMA text)*
    ;

text
    : NEW_TEXT | NEW_ENTITY_IDENTIFIER
    ;

newEntityName
    : NEW_ENTITY_IDENTIFIER
    ;

newEntityNameWithWS
    : NEW_ENTITY_IDENTIFIER_WITH_WS
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