// SQLCL's Command Registry
var CommandRegistry = Java.type("oracle.dbtools.raptor.newscriptrunner.CommandRegistry");

// CommandListener for creating any new command
var CommandListener =  Java.type("oracle.dbtools.raptor.newscriptrunner.CommandListener")

// Broke the .js out from the Java.extend to be easier to read
var cmd = {};

var binds = {};

// Called to attempt to handle any command
cmd.handle = function (conn,ctx,cmd) {
  if ( cmd.getSql().trim().startsWith("whoami") ) {
    var info = util.executeReturnList("select user"              + "\n"
                                    + "     , sid"               + "\n"
                                    + "     , serial# serial"    + "\n"
                                    + "     , server"            + "\n"
                                    + "     , schemaname"        + "\n"
                                    + "     , service_name"      + "\n"
                                    + "     , module"            + "\n"
                                    + "     , action"            + "\n"
                                    + "     , client_identifier" + "\n"
                                    + "  from v$session"         + "\n"
                                    + " where sid = sys_context('USERENV','SID')"
                                     ,binds);
//    ctx.write(info[0] + "\n"); -- Debug
    ctx.write( 'Logged in User:    '+ info[0].USER              + "\n");
    ctx.write( 'Session id:        '+ info[0].SID               + "\n");
    ctx.write( 'Session serial#:   '+ info[0].SERIAL            + "\n");
    ctx.write( 'Conn Server type:  '+ info[0].SERVER            + "\n");
    ctx.write( 'Current schema:    '+ info[0].SCHEMANAME        + "\n");
    ctx.write( 'Service:           '+ info[0].SERVICE_NAME      + "\n");
    ctx.write( 'Module:            '+ info[0].MODULE            + "\n");
    ctx.write( 'Action:            '+ info[0].ACTION            + "\n");
    ctx.write( 'Client identifier: '+ info[0].CLIENT_IDENTIFIER + "\n");
    return true;
}
   return false;
}

// fired before ANY command
cmd.begin = function (conn,ctx,cmd) {
}

// fired after ANY Command 
cmd.end = function (conn,ctx,cmd) {
}

// Actual Extend of the Java CommandListener

var WhoAmICommand = Java.extend(CommandListener, {
		   handleEvent:  cmd.handle ,
        beginEvent:  cmd.begin  , 
          endEvent:  cmd.end    
});

// Registering the new Command
CommandRegistry.addForAllStmtsListener(WhoAmICommand.class);