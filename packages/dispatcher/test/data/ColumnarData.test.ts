/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ColumnarData } from "../../src/data/ColumnarData";

import { NgramSubwordFeaturizer } from "../../src/model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../src/utility/Utility";

import { UnitTestHelper } from "../utility/Utility.test";

/* tslint:disable */

export const ColumnarContentEmail: string =
`Label	Weight	Text
AddFlag	1	add flag to the email john just sent to me
AddFlag	1	make it flagged
AddFlag	1	i want to add a flag on this email
AddFlag	1	add a flag please
AddFlag	1	flag this email as important for me
AddFlag	1	add a flag to the last email
AddFlag	1	this email should be flagged
AddFlag	1	add flag to this email
AddFlag	1	put a flag on the new email
AddFlag	1	add a flag
AddFlag	1	the email to ruth needs to be flagged
AddFlag	1	mark as flag
AddFlag	1	add flag to it
AddFlag	1	flag
AddFlag	1	put a flag
AddFlag	1	flag this email
AddFlag	1	turn flag on
AddFlag	1	flag it
AddFlag	1	flag on
AddFlag	1	flag the current email
AddFlag	1	i want to add a flag
AddFlag	1	flag the email from davis
AddFlag	1	add flag
AddFlag	1	the email from thomas should be flagged
AddFlag	1	add a flag to this email
AddFlag	1	flag the email
AddFlag	1	this email needs to be flagged
AddFlag	1	this email need to be flagged
AddFlag	1	add flag to this message
AddFlag	1	add flag on it
AddFlag	1	mark the email flagged
AddMore	1	i need to add something else to my email to cheryl
AddMore	1	add more and change the message
AddMore	1	i need to add more to the email
AddMore	1	add: call me tonight after work
AddMore	1	write more
AddMore	1	i need to add more to the email message i am sending to vincent
AddMore	1	put some additional lines to this message
AddMore	1	i need to add more text
AddMore	1	add more to message
AddMore	1	add a picture
AddMore	1	add a file to the email
AddMore	1	please add it was terrible
AddMore	1	i would like to add more to the email message
AddMore	1	add more message
AddMore	1	need to add information to the previous email
AddMore	1	add some more
AddMore	1	add a subject
AddMore	1	i'd like to add more to the email
AddMore	1	add photo
AddMore	1	add more to the last email
AddMore	1	add, by the way, what's the plan of next step
AddMore	1	i would like to add more to the email
AddMore	1	add to body of email
AddMore	1	append an attachment to this email
AddMore	1	edit email so i can type an additional message
AddMore	1	add another line to the message
AddMore	1	i need to add further contents
AddMore	1	insert more lines for me please
AddMore	1	add something
AddMore	1	add more to the message
AddMore	1	i forgot to add an important part to that email to james . please set it up to edit
AddMore	1	is it ok if i add more to the email
AddMore	1	i need to add additional lines
AddMore	1	add more please
AddMore	1	i need to add more message
AddMore	1	add more details to it
AddMore	1	add more
AddMore	1	please add more
AddMore	1	i need to add something else to that email to donna before it is sent
AddMore	1	can i add more to the email
AddMore	1	i'd like to add a bit more to the email.
AddMore	1	i'd like to add a bit more to the message
AddMore	1	add more to roy 's email
AddMore	1	add more text please
AddMore	1	i want to add more the email
AddMore	1	can i add more to the message
AddMore	1	add more to email body
AddMore	1	i would like to open a new line
AddMore	1	i wish to add more to the message
AddMore	1	i am not done yet. i need to add some more details
AddMore	1	add did you enjoy the entire program
AddMore	1	ok, i need to add a few things to that
AddMore	1	more text
AddMore	1	add more to the email
AddMore	1	add file to email
AddMore	1	wait, i need to write more
AddMore	1	add more to it
AddMore	1	add more to text
AddMore	1	add more text
AddMore	1	add more don't forget to bring beer
AddMore	1	it isn't complete, need more contents
AddMore	1	add more to email
AddMore	1	please add, please let me know what i can bring. i'd be happy to make a side dish or dessert
AddMore	1	attach file
AddMore	1	insert more text in my email
CancelMessages	1	cancel my email to jane
CancelMessages	1	don't show me
CancelMessages	1	don't send that email
CancelMessages	1	can you cancel it
CancelMessages	1	don't email to her
CancelMessages	1	forget about the email
CancelMessages	1	don ' t read
CancelMessages	1	never mind cancel the message
CancelMessages	1	stop reading
CancelMessages	1	never mind cancel the mail
CancelMessages	1	okay cancel sending the mail
CancelMessages	1	cancel this email
CancelMessages	1	quit the sending
CancelMessages	1	cancel the mail
CancelMessages	1	don't send out
CancelMessages	1	don't send this email
CancelMessages	1	cancel email
CancelMessages	1	don't read the message
CancelMessages	1	neither of them
CancelMessages	1	don't send it
CancelMessages	1	cancel message
CancelMessages	1	stop message
CancelMessages	1	don't email
CancelMessages	1	exit
CancelMessages	1	i want you to cancel the email
CancelMessages	1	never mind, forget about the mail
CancelMessages	1	cancel this sending process
CancelMessages	1	don't send
CancelMessages	1	no, i don't want to send this message
CancelMessages	1	no just cancel the email
CancelMessages	1	don ' t read it
CancelMessages	1	nevermind cancel
CancelMessages	1	cancel email to natalie
CancelMessages	1	cancel the message
CancelMessages	1	don't read the email
CancelMessages	1	no, no, cancel the reading
CancelMessages	1	cancel searching the messages
CancelMessages	1	abort deletion
CancelMessages	1	cancel the email to my sister
CancelMessages	1	cancel this message
CancelMessages	1	don 't send the email
CancelMessages	1	cancel the email sent to alex
CancelMessages	1	cancel the email
CancelMessages	1	no don't send
CancelMessages	1	no don't send it
CancelMessages	1	no cancel it, i don't want to send the mail
CheckMessages	1	do i have new message
CheckMessages	1	does anyone send message to me just then
CheckMessages	1	do i receive new message
CheckMessages	1	does anyone send email to me just then
CheckMessages	1	do i have any new mail
CheckMessages	1	does my outlook have new email
CheckMessages	1	could you please check my emails
CheckMessages	1	please check my emails
CheckMessages	1	is there new email
CheckMessages	1	any new email now
CheckMessages	1	whether i get new message
CheckMessages	1	check outlook please
CheckMessages	1	whether i have new email
CheckMessages	1	do i receive new mail in outlook
CheckMessages	1	show the important emails in my inbox
CheckMessages	1	any new message now
CheckMessages	1	check my inbox
CheckMessages	1	show my unread mails
CheckMessages	1	i'd like to check my inbox
CheckMessages	1	do i receive new email
CheckMessages	1	check email
CheckMessages	1	whether i have new message
CheckMessages	1	do i get new email
CheckMessages	1	check email please
CheckMessages	1	i want to check my inbox
CheckMessages	1	please check my inbox
CheckMessages	1	could you please check my inbox
CheckMessages	1	show latest emails
CheckMessages	1	check up messages
CheckMessages	1	check up email
CheckMessages	1	whether i receive new email
CheckMessages	1	show my emails
CheckMessages	1	please check my outlook
CheckMessages	1	check my message
CheckMessages	1	i want to check my emails
CheckMessages	1	check my gmail
CheckMessages	1	check my email please
CheckMessages	1	any new email
CheckMessages	1	do i have new email now
CheckMessages	1	any new email available
CheckMessages	1	could you please check my messages
CheckMessages	1	do i have new email
CheckMessages	1	check my emails
CheckMessages	1	whether i get new email
CheckMessages	1	check my mail box
ConfirmMessages	1	no problem, go ahead send the mail
ConfirmMessages	1	just do it
ConfirmMessages	1	yeah right, send to alex
ConfirmMessages	1	ok, good, just send it
ConfirmMessages	1	of course, just delete the mail
ConfirmMessages	1	"yes, you can"
ConfirmMessages	1	yes, send it
ConfirmMessages	1	i confirm that i want to send this email
ConfirmMessages	1	perfect thank you
ConfirmMessages	1	alright, just send the message
ConfirmMessages	1	okay, send it now
ConfirmMessages	1	"sure, go ahead"
ConfirmMessages	1	ok, good to me, send it please
ConfirmMessages	1	correct, please send it.
ConfirmMessages	1	yes it's right
ConfirmMessages	1	right, send it please
ConfirmMessages	1	ok send the mail to may
ConfirmMessages	1	okay send it
ConfirmMessages	1	"okay, send it"
ConfirmMessages	1	yes that's right
ConfirmMessages	1	okay
Delete	1	can you help me delete it
Delete	1	delete the previous 4 emails
Delete	1	empty the email inbox
Delete	1	put it in the recycle bin
Delete	1	delete the email from my hotmail account
Delete	1	delete all emails from tom
Delete	1	remove the emails received yesterday
Delete	1	delete this message permanently
Delete	1	put the emails from this file folder to trash bin
Delete	1	remove emails that are duplicate
Delete	1	remove it from my inbox
Delete	1	delete this email
Delete	1	remove the email from mary
Delete	1	put the email to trash bin
Delete	1	remove emails with red flags
Delete	1	delete all emails received tonight
Delete	1	delete the email sent from mary jane
Delete	1	clear my inbox
Delete	1	delete the unread emails
Delete	1	delete the first email for me
Delete	1	delete what i just wrote
Delete	1	delete the red ones
Delete	1	put the email in the recycle bin
Delete	1	delete the second one
Delete	1	delete the last one
Delete	1	delete the second mail
Forward	1	forward message to girlfriend
Forward	1	forward email to girlfriend
Forward	1	could you please forward this email to my sister
Forward	1	forward to alan tonight
Forward	1	forward this email to patricia
Forward	1	forward the last email to susan
Forward	1	please forward this message
Forward	1	forward the email from john smith to michelle by saying fyi
Forward	1	forward to thomas please
Forward	1	forward to partoneparttwo@gmail.com next monday
Forward	1	forward to wife by saying i love you
Forward	1	forward to deborah with a message saying that i don't want that
Forward	1	forward to dorothy by typing i agree with it
Forward	1	forward the email to dad
Forward	1	forward to my boss and attach the schedule file
Forward	1	forward emails to gabriel
Forward	1	forward this email to gary brown please
Forward	1	forward by saying if you interest to rebecca
Forward	1	forward this email
Forward	1	forward the email from melissa to peter
Forward	1	forward to brian potter tonight
Forward	1	forward this email to joseph
Forward	1	forward email
Forward	1	please forward this email to partoneparttwo@163.com
Forward	1	could you forward this message to ronald and roy
Forward	1	please forward this email to albert by typing everything goes fine
Forward	1	please forward to benjamin
Forward	1	forward all files from sally to austin
Forward	1	forward this email to partone dot parttwo at gmail dot com
Forward	1	forward to mom
Forward	1	forward this email to eugene by typing what do you think
Forward	1	please forward this email to partoneparttwo@outlook.com
None	1	2
None	1	the first one
None	1	the second one
None	1	the third one
None	1	1
None	1	3
QueryLastText	1	please tell me who emailed me last
QueryLastText	1	open the last email
QueryLastText	1	come to the last
QueryLastText	1	what was the last email
QueryLastText	1	what is the lastest email i received from dad
QueryLastText	1	the last email
QueryLastText	1	whose email just then
QueryLastText	1	show me the lastest email
QueryLastText	1	who recently emailed me
QueryLastText	1	who emailed me last
QueryLastText	1	who sent me the email lastly yesterday
QueryLastText	1	what was the last email i got from steve edwards
QueryLastText	1	who email me just now
QueryLastText	1	show the last email
QueryLastText	1	who emailed me just now
QueryLastText	1	open the lastest email i got
QueryLastText	1	what harry last email said
QueryLastText	1	i want to see the last email
QueryLastText	1	what did mom just say
QueryLastText	1	show me the newest email
QueryLastText	1	what was the last email i got from dad
QueryLastText	1	what henry just said
QueryLastText	1	last email
QueryLastText	1	who texted me
QueryLastText	1	can you tell me the last email i received
QueryLastText	1	who sent me the mail just now
QueryLastText	1	whose email now
QueryLastText	1	go to the last one
QueryLastText	1	what is the last email i received today
QueryLastText	1	who emailed me
QueryLastText	1	what eric watson just said
QueryLastText	1	who texted me just now
ReadAloud	1	read me the email on apple
ReadAloud	1	read email
ReadAloud	1	read my most recent email
ReadAloud	1	read my last email
ReadAloud	1	read aloud my new email
ReadAloud	1	read me my latest emails
ReadAloud	1	read me the newest email
ReadAloud	1	read my last email out to me
ReadAloud	1	read out the email from liu about transfer
ReadAloud	1	read unread message
ReadAloud	1	read it
ReadAloud	1	read emails
ReadAloud	1	read last incoming emails
ReadAloud	1	read my recent email to me
ReadAloud	1	read my emails from patty
ReadAloud	1	read latest email
ReadAloud	1	read the last email
ReadAloud	1	read the latest email from mom
ReadAloud	1	read email to me
ReadAloud	1	read my email messages
ReadAloud	1	read me the last emails of the five minutes
ReadAloud	1	read first email in the linked inbox
ReadAloud	1	read my second email
ReadAloud	1	read last email received
ReadAloud	1	read emails from clay
ReadAloud	1	read new email from david ma
ReadAloud	1	read my email from tyler swift
ReadAloud	1	read me the email titled happy new year
ReadAloud	1	read my email please
ReadAloud	1	read todays mail
ReadAloud	1	read my email to me
ReadAloud	1	read my email from baby
ReadAloud	1	read most recent email
ReadAloud	1	read first email in link box
ReadAloud	1	read google mail
ReadAloud	1	read email from dawn
ReadAloud	1	read darren's mail on the movie
ReadAloud	1	read me the email sent on thanksgiving day
ReadAloud	1	read recent email
ReadAloud	1	read my notification
ReadAloud	1	read my inbox
ReadAloud	1	read new message
ReadAloud	1	read mary grace white email
ReadAloud	1	please read my last email
ReadAloud	1	read my recent email
ReadAloud	1	read the first email in hotmail
ReadAloud	1	read me the email
ReadAloud	1	read me the emails from agatha
ReadAloud	1	read my emails
ReadAloud	1	read last mail
ReadAloud	1	read the first email
ReadAloud	1	read the last email message
ReadAloud	1	read out darren's mail
ReadAloud	1	read email from kat
ReadAloud	1	read new email
ReadAloud	1	read my email from hubby
ReadAloud	1	read my new email
ReadAloud	1	read me the last email claude sent
ReadAloud	1	read the latest email from steve lip
ReadAloud	1	read my recent email message please
ReadAloud	1	read me the recent email titled abcd from jessica
ReadAloud	1	read unread email
ReadAloud	1	read the email
ReadAloud	1	read the email on auto repair
ReadAloud	1	read my outlook email
ReadAloud	1	read today's mail
ReadAloud	1	read me dylan's email sent on yesterday
ReadAloud	1	read my new emails
ReadAloud	1	read aloud the christmas party email
ReadAloud	1	read please
ReadAloud	1	read email from mum
ReadAloud	1	could you read out the email on how to use the new tool
ReadAloud	1	read my recent email messages
ReadAloud	1	read me jessica's email on dress code for the party
ReadAloud	1	read me the email on thanksgiving day
ReadAloud	1	read me my last hotmail email
ReadAloud	1	can you read my emails
ReadAloud	1	read out xu's email about apple's news
ReadAloud	1	read the latest email i sent
ReadAloud	1	can you read my last email
Reply	1	reply by saying i love you
Reply	1	reply yee ha
Reply	1	reply with hello
Reply	1	email back
Reply	1	reply to the first one
Reply	1	email back i will call you back
Reply	1	send email back
Reply	1	reply by saying yes
Reply	1	respond to lore hound
Reply	1	create a response to the email by saying pls send me the picture again
Reply	1	respond to the email by saying i am busy today
Reply	1	reply yee hello
Reply	1	reply by email thank you very much best regards jun
Reply	1	reply required to an email
Reply	1	respond i ' m sick i can ' t do it
Reply	1	reply to the email
Reply	1	send the response with i've already know
Reply	1	reply that i am busy
Reply	1	reply to edward
Reply	1	reply to email i am busy now
Reply	1	reply we'll see you later
Reply	1	reply to susan
Reply	1	make a response with thank you very much
Reply	1	respond to nathan
Reply	1	how to reply to an email
Reply	1	reply to my last email
Reply	1	return siberian huskies mobile
Reply	1	return barbara on mobile
Reply	1	reply by typing hello
Reply	1	reply
Reply	1	reply yes boss.
SearchMessages	1	show me emails from clara chan
SearchMessages	1	email sent from lisa
SearchMessages	1	search keywordsone keywordstwo from inbox
SearchMessages	1	did i get any email from tom
SearchMessages	1	find mails titled recommended courses
SearchMessages	1	detect the email containing keyword beauty
SearchMessages	1	find emails from mom
SearchMessages	1	find an email from abc123@outlook.com
SearchMessages	1	search keywords keywordone keywordtwo in my emails
SearchMessages	1	search text with words lunch together
SearchMessages	1	show me the email about spring festival
SearchMessages	1	search emails contain work items
SearchMessages	1	show me the email sent from mom
SearchMessages	1	show me the email from tom and filtering with word lunch
SearchMessages	1	show me emails from girlfriend
SearchMessages	1	search an email with subject background screening
SearchMessages	1	find email titled new design
SearchMessages	1	tell me the email from lily wong
SearchMessages	1	list the emails contain funny picture
SearchMessages	1	emails contains bank
SearchMessages	1	find emails with resume
SearchMessages	1	find an email from angela
SearchMessages	1	query emails with bill
SearchMessages	1	can you search my emails
SearchMessages	1	find emails that contain malta
SearchMessages	1	detect the email from lisa
SearchMessages	1	find email with title production tools
SearchMessages	1	search the emails contains money
SearchMessages	1	search emails from mike
SearchMessages	1	find an email on the dinner reservation
SearchMessages	1	did i get emails from tom
SearchMessages	1	search my emails
SearchMessages	1	detect emails from betty
SearchMessages	1	find an email about new year's planning
SearchMessages	1	search emails contains coupons
SearchMessages	1	search email with key words lunch
SearchMessages	1	tell me the email with subject weekly report
SearchMessages	1	show emails with "credit card"
SearchMessages	1	search bla bla in my emails
SearchMessages	1	show emails contain words "future plan"
SearchMessages	1	search the email with keywords hello
SearchMessages	1	search emails about boating
SearchMessages	1	find an email from jay that contains halloween
SearchMessages	1	looking for an email with hello
SearchMessages	1	search the emails contains microsoft
SearchMessages	1	search jensen's emails
SearchMessages	1	search email contain outlook
SearchMessages	1	enumerate the emails with algroithm
SearchMessages	1	did i get the email containing keyword lunch
SendEmail	1	email my presentation
SendEmail	1	send and email about swim team practice
SendEmail	1	email to cynthia and mike, that dinner last week was splendid.
SendEmail	1	send an urgent email from my work account to christian
SendEmail	1	send an email to jacqueline and tianyu about the test result
SendEmail	1	send an email to larry , joseph and billy larkson
SendEmail	1	set an email today
SendEmail	1	send this document to an email
SendEmail	1	send email to kai xu, mingming and my mother
SendEmail	1	send an email about swim team practice
SendEmail	1	start new email to friends about the club
SendEmail	1	new email about really good talk to michelle
SendEmail	1	send important email to evelyn and gary
SendEmail	1	send an email to partone@gmail.com
SendEmail	1	send the email now
SendEmail	1	write an urgent email to bobby
SendEmail	1	send an urgent email
SendEmail	1	start up a new email to michelle about watching baseball
SendEmail	1	send a new email about the problem solving to andrea, angela, and ron
SendEmail	1	send an email to mom
SendEmail	1	send email to partone.parttwo@outlook.com
SendEmail	1	send an email marked with a bang to amy
SendEmail	1	the new email is high priority that is being sent to jacob
SendEmail	1	send an email to lily roth and abc123@microsoft.com
SendEmail	1	send an email
SendEmail	1	send lori a new flagged email
SendEmail	1	send an email for me
SendEmail	1	send the email
SendEmail	1	send an email to jimmy klein saying this is the message about weekend plans
SendEmail	1	send a new email about the hockey tournament to marie jane, joseph , and john
SendEmail	1	send an email to my brother
SendEmail	1	send thomas an email
SendEmail	1	send an email to lu , yue and qiong about funding
SendEmail	1	send angela an email marked as high priority
SendEmail	1	send an important email to olivia
SendEmail	1	new email to kimberly about wingman
SendEmail	1	send mail to dorothy
SendEmail	1	send an email to harry potter
SendEmail	1	send an email to christopher carpenter about the hiking trip
SendEmail	1	send email marked priority to yun-sim and yi
SendEmail	1	email my brother
SendEmail	1	send my housekeeping doc to jeffrey
SendEmail	1	send a new high importance email to jordan
SendEmail	1	write an email about the fundraiser
SendEmail	1	send email to jiayi today
SendEmail	1	email to tom white about that flower saying beautiful
SendEmail	1	send an email to partone_parttwo@microsoft.com
SendEmail	1	send an email about test status to mark
SendEmail	1	send jacqueline an email with low priority
SendEmail	1	email her the message "fine, ok"
SendEmail	1	start a new email saying lets go to the park
SendEmail	1	start new email about taco blog to nicole and emily
SendEmail	1	write email
SendEmail	1	send a mail to daniel
SendEmail	1	email to lawrence about opening issue
SendEmail	1	send a email to leehom wong about the piano concert saying it's wonderful
SendEmail	1	make a new email about weather forecast
SendEmail	1	send an email about the window that is broken
SendEmail	1	send an email to sean about weekend plans
SendEmail	1	send email to hannah saying test
SendEmail	1	write email to mom subject is babysit
SendEmail	1	send an email to a.j.ron marked as important
SendEmail	1	send an urgent email from my work email to jack
SendEmail	1	email the file to henry mathew
SendEmail	1	send a new email to larry with a file attached
SendEmail	1	send new email to christian and mark it high importance
SendEmail	1	send an email marked for follow up to christian
SendEmail	1	compose new email about spanish homework
SendEmail	1	start a new email from tracy saying here is my resume
SendEmail	1	send email to a and tian
SendEmail	1	send a read receipt email to samuel
SendEmail	1	write an email which title is hello and context is let's have meeting together
SendEmail	1	send alexander a red bang email
SendEmail	1	send an email to zachary about we can plan things let's go hiking
SendEmail	1	i need to send an email about the words to a song
SendEmail	1	send an email today
SendEmail	1	send my payment visio diagram to ronald
SendEmail	1	send email about homework plan to raymond and philip
SendEmail	1	email to amy cooper about haha saying hello
SendEmail	1	email to mike waters : mike, that dinner last week was splendid.
SendEmail	1	send email to louis and mark it important
SendEmail	1	start a new email to aaron about sleeping over tonight
SendEmail	1	send billy an email with a red bang
SendEmail	1	create new mail titled urgent meeting information to jonathan
SendEmail	1	mark email for follow up and send to arthur
SendEmail	1	start a new email about marriage counselor appointments
SendEmail	1	send a new email to partonepartwopartthree@yahoo.com
SendEmail	1	new email about writing documents
SendEmail	1	send email to heather about car
SendEmail	1	email to partoneparttwo@gmail.com
SendEmail	1	send an email marked follow up to jerry
SendEmail	1	will you send a marked non urgent email to james
SendEmail	1	send an email with read receipt to peter
SendEmail	1	send large files through email
SendEmail	1	email to harry potter and hermione granger
SendEmail	1	send an email to nathan with a red bang
SendEmail	1	send a new email to nicholas and jesse about coupons
SendEmail	1	start an email to jason about speaking up
SendEmail	1	send a new email about facebook
SendEmail	1	send an email to harold and bob kappus about team lunch saying same team lunch this tuesday
ShowNext	1	move on to next mails
ShowNext	1	move on next mail by jason
ShowNext	1	show the next emails by wong
ShowNext	1	show me next from mary
ShowNext	1	next email
ShowNext	1	go on, show me more mails
ShowNext	1	the next important message
ShowNext	1	move forward
ShowNext	1	show next unread
ShowNext	1	go to next mail
ShowNext	1	show next email
ShowNext	1	go forward to next mails
ShowNext	1	next unread one
ShowNext	1	go to the next page
ShowNext	1	show the next messages
ShowNext	1	show the next email from my boss
ShowNext	1	next unread email
ShowNext	1	show me the next five mails
ShowNext	1	are there any unread messages? show next
ShowNext	1	the next email
ShowNext	1	show me the next
ShowPrevious	1	show me the last three mails
ShowPrevious	1	show me the previous email
ShowPrevious	1	show previous one in inbox
ShowPrevious	1	go to previous mails
ShowPrevious	1	show me previous email from jack
ShowPrevious	1	show previous in red category
ShowPrevious	1	show me the one before
ShowPrevious	1	previous email
ShowPrevious	1	show the previous email from my mentor
ShowPrevious	1	move back to last mails
ShowPrevious	1	the previous email
ShowPrevious	1	bring the previous one, i want to read it again
ShowPrevious	1	back to the last one from apple
ShowPrevious	1	previous one please
ShowPrevious	1	show the previous one
ShowPrevious	1	what is the previous email
`;

/* tslint:enable */

export function exampleFunctionDataWithLuContent(
    luContent: string,
    labelColumnIndex: number,
    textColumnIndex: number,
    linesToSkip: number): ColumnarData {
    // -----------------------------------------------------------------------
    const columnarData: ColumnarData = ColumnarData.createColumnarData(
        luContent,
        new NgramSubwordFeaturizer(),
        labelColumnIndex,
        textColumnIndex,
        linesToSkip);
    const luUtterances: any[] = columnarData.getLuUtterances();
    // Utility.debuggingLog(`luJsonStructure=${Utility.getJsonStringified(luUtterances)}`);
    assert.ok(luUtterances, `luUtterances=${luUtterances}`);
    const intentInstanceIndexMapArray: Map<string, number[]> = columnarData.getIntentInstanceIndexMapArray();
    // Utility.debuggingLog(`intentInstanceIndexMapSet=${Utility.stringMapArrayToJson(intentInstanceIndexMapArray)}`);
    const entityTypeInstanceIndexMapArray: Map<string, number[]> = columnarData.getEntityTypeInstanceIndexMapArray();
    // Utility.debuggingLog(`entityTypeInstanceIndexMapSet=` +
    //     `${Utility.stringMapArrayToJson(entityTypeInstanceIndexMapArray)}`);
    const numberLuUtterances: number = columnarData.getNumberLuUtterances();
    Utility.debuggingLog(`numberLuUtterances=${numberLuUtterances}`);
    assert.ok(numberLuUtterances === 601, `numberLuUtterances=${numberLuUtterances}`);
    const numberIntents: number = columnarData.getNumberIntents();
    Utility.debuggingLog(`numberIntents=${numberIntents}`);
    assert.ok(numberIntents === 15, `numberIntents=${numberIntents}`);
    const numberEntityTypes: number = columnarData.getNumberEntityTypes();
    Utility.debuggingLog(`numberEntityTypes=${numberEntityTypes}`);
    assert.ok(numberEntityTypes === 0, `numberEntityTypes=${numberEntityTypes}`);
    // -----------------------------------------------------------------------
    const minNumberUtterancesToCoverAllIntentAndEntityTypeLabels: number =
        Math.max(numberIntents, numberEntityTypes);
    const maxNumberUtterancesToCoverAllIntentAndEntityTypeLabels: number =
        numberIntents + numberEntityTypes;
    const maxNumberCandidateUtterancesForSampling: number =
        numberLuUtterances - minNumberUtterancesToCoverAllIntentAndEntityTypeLabels;
    const minNumberCandidateUtterancesForSampling: number =
        numberLuUtterances - maxNumberUtterancesToCoverAllIntentAndEntityTypeLabels;
    // -----------------------------------------------------------------------
    const results =
        columnarData.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
    const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        results.smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        results.smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels;
    const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
        results.smallUtteranceIndexSetCoveringAllIntentEntityLabels;
    const remainingUtteranceIndexSet: Set<number> =
        results.remainingUtteranceIndexSet;
    // Utility.debuggingLog(`smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels=` +
    //     `${Utility.setToJson(smallUtteranceIndexSetCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`remainingUtteranceIndexSet=` +
    //     `${Utility.setToJson(remainingUtteranceIndexSet)}`);
    // Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
    //     `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
    assert.ok(
        smallUtteranceIndexSetCoveringAllIntentEntityLabels.size >=
        minNumberUtterancesToCoverAllIntentAndEntityTypeLabels,
        `smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
        `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}` +
        `, minNumberUtterancesToCoverAllIntentAndEntityTypeLabels=` +
        `${minNumberUtterancesToCoverAllIntentAndEntityTypeLabels}`);
    assert.ok(
        smallUtteranceIndexSetCoveringAllIntentEntityLabels.size <=
        maxNumberUtterancesToCoverAllIntentAndEntityTypeLabels,
        `smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
        `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}` +
        `, maxNumberUtterancesToCoverAllIntentAndEntityTypeLabels=` +
        `${maxNumberUtterancesToCoverAllIntentAndEntityTypeLabels}`);
    Utility.debuggingLog(`remainingUtteranceIndexSet.size=` +
        `${remainingUtteranceIndexSet.size}`);
    assert.ok(
        remainingUtteranceIndexSet.size <= maxNumberCandidateUtterancesForSampling,
        `remainingUtteranceIndexSet.size=` +
        `${remainingUtteranceIndexSet.size}` +
        `, maxNumberCandidateUtterancesForSampling=` +
        `${maxNumberCandidateUtterancesForSampling}`);
    assert.ok(
        remainingUtteranceIndexSet.size >= minNumberCandidateUtterancesForSampling,
        `remainingUtteranceIndexSet.size=` +
        `${remainingUtteranceIndexSet.size}` +
        `, minNumberCandidateUtterancesForSampling=` +
        `${minNumberCandidateUtterancesForSampling}`);
    // -----------------------------------------------------------------------
    const limitInitialNumberOfInstancesPerCategory: number = 10;
    const resultsInitialSampling =
        columnarData.collectUtteranceIndexSetSeedingIntentTrainingSet(
            smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
            remainingUtteranceIndexSet,
            limitInitialNumberOfInstancesPerCategory);
    const seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        resultsInitialSampling.seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    const candidateUtteranceIndexSetSampled: Set<number> =
        resultsInitialSampling.candidateUtteranceIndexSetSampled;
    const candidateUtteranceIndexSetRemaining: Set<number> =
        resultsInitialSampling.candidateUtteranceIndexSetRemaining;
    // Utility.debuggingLog(`seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetSampled=` +
    //     `${Utility.setToJson(candidateUtteranceIndexSetSampled)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetRemaining=` +
    //     `${Utility.setToJson(candidateUtteranceIndexSetRemaining)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetSampled.size=` +
    //     `${candidateUtteranceIndexSetSampled.size}`);
    assert.ok(
        candidateUtteranceIndexSetSampled.size +
        smallUtteranceIndexSetCoveringAllIntentEntityLabels.size === 146,
        `candidateUtteranceIndexSetSampled.size=` +
        `${candidateUtteranceIndexSetSampled.size}` +
        `, smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
        `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetRemaining.size=` +
        `${candidateUtteranceIndexSetRemaining.size}`);
    assert.ok(
        candidateUtteranceIndexSetRemaining.size === 455,
        `candidateUtteranceIndexSetRemaining.size=` +
        `${candidateUtteranceIndexSetRemaining.size}`);
    const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
        [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
            (accumulation: number, entry: [string, Set<number>]) => accumulation + entry[1].size, 0);
    Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
    assert.ok(
        countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels === 146,
        `countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
    // -----------------------------------------------------------------------
    const featurizerLabelsLength: number = columnarData.getFeaturizerLabels().length;
    Utility.debuggingLog(`featurizerLabelsLength=` +
        `${featurizerLabelsLength}`);
    assert.ok(
        featurizerLabelsLength === 15,
        `featurizerLabelsLength=` +
        `${featurizerLabelsLength}`);
    const featurizerFeaturesLength: number = columnarData.getFeaturizerFeatures().length;
    Utility.debuggingLog(`featurizerFeaturesLength=` +
        `${featurizerFeaturesLength}`);
    assert.ok(
        featurizerFeaturesLength === 5641,
        `featurizerFeaturesLength=` +
        `${featurizerFeaturesLength}`);
    // -----------------------------------------------------------------------
    return columnarData;
    // -----------------------------------------------------------------------
}

describe("Test Suite - data/columnar_data/ColumnarData - Email", () => {
    it("Test.0000 exampleFunctionDataWithLuContent()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
        const columnarData: ColumnarData = exampleFunctionDataWithLuContent(
            ColumnarContentEmail,
            0,
            2,
            1);
    });
});
