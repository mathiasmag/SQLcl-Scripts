var CommandRegistry = Java.type("oracle.dbtools.raptor.newscriptrunner.CommandRegistry");

var CommandListener = Java.type("oracle.dbtools.raptor.newscriptrunner.CommandListener")

var cmd = {};

var binds = {};

cmd.handle = function (conn, ctx, cmd) {
  var subCmd = cmd.getSql().trim().split(" ")
  if (subCmd[0] === 'sss') {
    binds.schema_name = subCmd[1];
      var info = util.executeReturnList(
        "select username\n"
      + "  from all_users\n"
      + " where (:schema_name is null\n"
      + "    or username like '%' || upper(:schema_name) || '%')\n"
      + " order by username"
      , binds);

      if (info.length > 0) {
        if (info.length === 1) {
          util.execute('alter session set current_schema = ' + info[0].USERNAME);
          binds.length = 0;
          var new_schema = util.executeReturnOneCol("select sys_context('USERENV', 'CURRENT_SCHEMA') from dual", binds);
          ctx.write("Current schema is now: " + new_schema + "\n");
        }
        else {
          for (i=0;i < info.length; i++) {
            ctx.write(info[i].USERNAME + "\n");
          }
        }
      }
    return true;
  }
  return false;
}

cmd.begin = function (conn, ctx, cmd) {
}

cmd.end = function (conn, ctx, cmd) {
}

// Actual Extend of the Java CommandListener

var myCommand = Java.extend(CommandListener, {
  handleEvent: cmd.handle,
  beginEvent: cmd.begin,
  endEvent: cmd.end
});

// Registering the new Command
CommandRegistry.addForAllStmtsListener(myCommand.class);