var CommandRegistry = Java.type("oracle.dbtools.raptor.newscriptrunner.CommandRegistry");

var CommandListener = Java.type("oracle.dbtools.raptor.newscriptrunner.CommandListener")

var cmd = {};

var binds = {};

cmd.handle = function (conn, ctx, cmd) {
  var subCmd = cmd.getSql().trim().split(" ")
  if (subCmd[0] === 'ssc') {
    var orig_container = util.executeReturnOneCol("select sys_context('USERENV', 'CON_NAME') from dual", binds);
    util.execute('alter session set container = cdb$root');

    binds.name = subCmd[1];
      var info = util.executeReturnList(
        "select name\n"
      + "  from v$pdbs\n"
      + " where (:name is null\n"
      + "    or name like '%' || upper(:name) || '%')\n"
      + "   and open_mode in('READ WRITE','READ ONLY')\n"
      + " union all\n"
      + "select 'CDB$ROOT' from dual where 'CDB$ROOT' like '%' || upper(:name) || '%'"
      , binds);

      if (info.length > 0) {
        if (info.length === 1) {
          util.execute('alter session set container = ' + info[0].NAME);
          binds.length = 0;
          var name = util.executeReturnOneCol("select sys_context('USERENV', 'CON_NAME') from dual", binds);
          ctx.write("Current container is now: " + name + "\n");
        }
        else {
          for (i=0;i < info.length; i++) {
            ctx.write(info[i].NAME + "\n");
          }
          util.execute('alter session set container = ' + orig_container);
          ctx.write('aa');
        }
      }
      else {
      util.execute('alter session set container = ' + orig_container);
      }
    return true;
  }
  return false;
}

cmd.begin = function (conn, ctx, cmd) {
}

cmd.end = function (conn, ctx, cmd) {
}

var myCommand = Java.extend(CommandListener, {
  handleEvent: cmd.handle,
  beginEvent: cmd.begin,
  endEvent: cmd.end
});

CommandRegistry.addForAllStmtsListener(myCommand.class);
