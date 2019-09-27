parser grammar LUFileParser;

options { tokenVocab=LUFileLexer; }

file
	: paragraph+? EOF
	;

paragraph
    : newline
    | nestedIntentSection
    | simpleIntentSection
    | entitySection
    | importSection
    | qnaSection
    | modelInfoSection
    ;

// Treat EOF as newline to hanle file end gracefully
// It's possible that parser doesn't even have to handle NEWLINE, 
// but before the syntax is finalized, we still keep the NEWLINE in grammer 
newline
    : NEWLINE
    | EOF
    ;

nestedIntentSection
    : nestedIntentNameLine newline+ nestedIntentBodyDefinition
    ;

nestedIntentNameLine
    : HASH nestedIntentName
    ;

nestedIntentName
    : nameIdentifier (WS|nameIdentifier)*
    ;

nameIdentifier
    : IDENTIFIER (DOT IDENTIFIER)*
    ;

nestedIntentBodyDefinition
    : (subIntentDefinition newline)+
    ;

subIntentDefinition
    : HASH simpleIntentSection
    ;

simpleIntentSection
    : intentDefinition newline? (entitySection newline)*
    ;

intentDefinition
	: intentNameLine newline intentBody?
	;

intentNameLine
	: HASH intentName
	;

intentName
    : nameIdentifier (WS|nameIdentifier)*
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

entitySection
    : entityDefinition
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

importSection
    : importDefinition
    ;

importDefinition
    : IMPORT_DESC IMPORT_PATH
    ;

qnaSection
    : qnaDefinition
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

modelInfoSection
    : modelInfoDefinition
    ;

modelInfoDefinition
    : MODEL_INFO
    ;