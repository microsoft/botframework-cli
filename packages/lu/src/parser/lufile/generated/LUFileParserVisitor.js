// Generated from LUFileParser.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by LUFileParser.

function LUFileParserVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

LUFileParserVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
LUFileParserVisitor.prototype.constructor = LUFileParserVisitor;

// Visit a parse tree produced by LUFileParser#file.
LUFileParserVisitor.prototype.visitFile = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#paragraph.
LUFileParserVisitor.prototype.visitParagraph = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newline.
LUFileParserVisitor.prototype.visitNewline = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#errorString.
LUFileParserVisitor.prototype.visitErrorString = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#nestedIntentSection.
LUFileParserVisitor.prototype.visitNestedIntentSection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#nestedIntentNameLine.
LUFileParserVisitor.prototype.visitNestedIntentNameLine = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#nestedIntentName.
LUFileParserVisitor.prototype.visitNestedIntentName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#nameIdentifier.
LUFileParserVisitor.prototype.visitNameIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#nestedIntentBodyDefinition.
LUFileParserVisitor.prototype.visitNestedIntentBodyDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#subIntentDefinition.
LUFileParserVisitor.prototype.visitSubIntentDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#simpleIntentSection.
LUFileParserVisitor.prototype.visitSimpleIntentSection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#intentDefinition.
LUFileParserVisitor.prototype.visitIntentDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#intentNameLine.
LUFileParserVisitor.prototype.visitIntentNameLine = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#intentName.
LUFileParserVisitor.prototype.visitIntentName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#intentBody.
LUFileParserVisitor.prototype.visitIntentBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#normalIntentBody.
LUFileParserVisitor.prototype.visitNormalIntentBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#normalIntentString.
LUFileParserVisitor.prototype.visitNormalIntentString = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntitySection.
LUFileParserVisitor.prototype.visitNewEntitySection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntityDefinition.
LUFileParserVisitor.prototype.visitNewEntityDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntityListbody.
LUFileParserVisitor.prototype.visitNewEntityListbody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntityLine.
LUFileParserVisitor.prototype.visitNewEntityLine = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newCompositeDefinition.
LUFileParserVisitor.prototype.visitNewCompositeDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newRegexDefinition.
LUFileParserVisitor.prototype.visitNewRegexDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntityType.
LUFileParserVisitor.prototype.visitNewEntityType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntityRoles.
LUFileParserVisitor.prototype.visitNewEntityRoles = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntityUsesFeatures.
LUFileParserVisitor.prototype.visitNewEntityUsesFeatures = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntityRoleOrFeatures.
LUFileParserVisitor.prototype.visitNewEntityRoleOrFeatures = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntityName.
LUFileParserVisitor.prototype.visitNewEntityName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#newEntityNameWithWS.
LUFileParserVisitor.prototype.visitNewEntityNameWithWS = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#entitySection.
LUFileParserVisitor.prototype.visitEntitySection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#entityDefinition.
LUFileParserVisitor.prototype.visitEntityDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#entityLine.
LUFileParserVisitor.prototype.visitEntityLine = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#entityName.
LUFileParserVisitor.prototype.visitEntityName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#entityType.
LUFileParserVisitor.prototype.visitEntityType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#compositeEntityIdentifier.
LUFileParserVisitor.prototype.visitCompositeEntityIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#regexEntityIdentifier.
LUFileParserVisitor.prototype.visitRegexEntityIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#entityListBody.
LUFileParserVisitor.prototype.visitEntityListBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#normalItemString.
LUFileParserVisitor.prototype.visitNormalItemString = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#importSection.
LUFileParserVisitor.prototype.visitImportSection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#importDefinition.
LUFileParserVisitor.prototype.visitImportDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#referenceSection.
LUFileParserVisitor.prototype.visitReferenceSection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#referenceDefinition.
LUFileParserVisitor.prototype.visitReferenceDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#qnaSection.
LUFileParserVisitor.prototype.visitQnaSection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#qnaDefinition.
LUFileParserVisitor.prototype.visitQnaDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#qnaSourceInfo.
LUFileParserVisitor.prototype.visitQnaSourceInfo = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#qnaIdMark.
LUFileParserVisitor.prototype.visitQnaIdMark = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#qnaQuestion.
LUFileParserVisitor.prototype.visitQnaQuestion = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#questionText.
LUFileParserVisitor.prototype.visitQuestionText = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#moreQuestionsBody.
LUFileParserVisitor.prototype.visitMoreQuestionsBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#moreQuestion.
LUFileParserVisitor.prototype.visitMoreQuestion = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#errorQuestionString.
LUFileParserVisitor.prototype.visitErrorQuestionString = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#qnaAnswerBody.
LUFileParserVisitor.prototype.visitQnaAnswerBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#filterSection.
LUFileParserVisitor.prototype.visitFilterSection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#promptSection.
LUFileParserVisitor.prototype.visitPromptSection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#filterLine.
LUFileParserVisitor.prototype.visitFilterLine = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#errorFilterLine.
LUFileParserVisitor.prototype.visitErrorFilterLine = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#multiLineAnswer.
LUFileParserVisitor.prototype.visitMultiLineAnswer = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#modelInfoSection.
LUFileParserVisitor.prototype.visitModelInfoSection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#modelInfoDefinition.
LUFileParserVisitor.prototype.visitModelInfoDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LUFileParser#commentSection.
LUFileParserVisitor.prototype.visitCommentSection = function(ctx) {
  return this.visitChildren(ctx);
};



exports.LUFileParserVisitor = LUFileParserVisitor;